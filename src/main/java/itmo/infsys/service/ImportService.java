package itmo.infsys.service;

import itmo.infsys.domain.dto.ImportDTO;
import itmo.infsys.domain.model.*;
import itmo.infsys.repository.CarRepository;
import itmo.infsys.repository.CoordRepository;
import itmo.infsys.repository.HumanRepository;
import itmo.infsys.repository.ImportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class ImportService {
    private final ImportRepository importRepository;
    private final UserService userService;
    private final CarRepository carRepository;
    private final CoordRepository coordRepository;
    private final HumanRepository humanRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    public ImportService(ImportRepository importRepository, UserService userService, CarRepository carRepository,
                         CoordRepository coordRepository, HumanRepository humanRepository, SimpMessagingTemplate simpMessagingTemplate) {
        this.importRepository = importRepository;
        this.userService = userService;
        this.carRepository = carRepository;
        this.coordRepository = coordRepository;
        this.humanRepository = humanRepository;
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    public ImportDTO createImport(String filename, Boolean status) {
        User user = userService.getCurrentUser();
        Import importt = importRepository.save(new Import(filename, status, user));
        simpMessagingTemplate.convertAndSend("/topic/import", importRepository.findAll());
        return mapImportToImportDTO(importt);
    }

    @Transactional
    public Boolean importFromFile(MultipartFile file)  {
        try {
            parseJsonFile(file);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return false;
        }
        simpMessagingTemplate.convertAndSend("/topic/car", carRepository.findAll());
        simpMessagingTemplate.convertAndSend("/topic/coord", coordRepository.findAll());
        simpMessagingTemplate.convertAndSend("/topic/human", humanRepository.findAll());
        return true;
    }

    private void parseJsonFile(MultipartFile file) throws Exception {
        String content = new String(file.getBytes());
        Gson gson = new Gson();
        Type listType = new TypeToken<List<Map<String, String>>>() {
        }.getType();
        List<Map<String, String>> jsonArray = gson.fromJson(content, listType);
        convertJsonToCitizenArray(jsonArray);
    }

    private void convertJsonToCitizenArray(List<Map<String, String>> json) throws Exception {
//        Human[] humans = new Human[json.size()];
        for (int i = 0; i < json.size(); i++) {
            Coord coord = new Coord(json.get(i), userService.getCurrentUser());
            Coord savedCoord = coordRepository.save(coord);
            Car car = new Car(json.get(i), userService.getCurrentUser());
            Car savedCar = carRepository.save(car);
            Human human = new Human(json.get(i), savedCoord, savedCar, userService.getCurrentUser());
            humanRepository.save(human);
        }
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
