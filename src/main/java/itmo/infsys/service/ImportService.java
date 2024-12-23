package itmo.infsys.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import itmo.infsys.domain.dto.ImportDTO;
import itmo.infsys.domain.model.Import;
import itmo.infsys.repository.ImportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class ImportService {
    private final ImportRepository importRepository;
    private final HumanService humanService;
    private final UserService userService;

    @Autowired
    public ImportService(ImportRepository importRepository, HumanService humanService, UserService userService) {
        this.importRepository = importRepository;
        this.humanService = humanService;
        this.userService = userService;
    }

    public ImportDTO createImport(MultipartFile file) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        List<ImportDTO> importDTOs = objectMapper.readValue(file.getInputStream(), objectMapper.getTypeFactory().constructCollectionType(List.class, ImportDTO.class));
        Boolean status = humanService.saveAll(importDTOs);
        Import importt = new Import(
                file.getName(),
                status,
                userService.getCurrentUser()
        );
        return mapImportToImportDTO(importt);
    }

    public Page<ImportDTO> getPageImports(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return mapImportsToImportDTOs(importRepository.findAll(pageable));
    }

    public ImportDTO mapImportToImportDTO(Import importt) {
        ImportDTO importDTO =  new ImportDTO(
                importt.getId(),
                importt.getName(),
                importt.getStatus(),
                importt.getUser().getId()
        );
        return importDTO;
    }

    public Page<ImportDTO> mapImportsToImportDTOs(Page<Import> importsPage) {
        List<ImportDTO> importDTOs = new ArrayList<>();
        for (Import importt : importsPage.getContent()) {
            importDTOs.add(mapImportToImportDTO(importt));
        }
        return new PageImpl<>(importDTOs, importsPage.getPageable(), importsPage.getTotalElements());
    }
}
