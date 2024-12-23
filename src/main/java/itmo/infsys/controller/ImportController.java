package itmo.infsys.controller;

import itmo.infsys.domain.dto.HumanDTO;
import itmo.infsys.domain.dto.ImportDTO;
import itmo.infsys.repository.ImportRepository;
import itmo.infsys.service.ImportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/file")
public class ImportController {
    private final ImportService importService;

    @Autowired
    public ImportController(ImportService importService) {
        this.importService = importService;
    }

    @GetMapping("/page")
    public Page<ImportDTO> getPageImports(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return importService.getPageImports(page, size);
    }

    @PostMapping
    public ResponseEntity<ImportDTO> createImport(@RequestParam("file") MultipartFile file) throws IOException {
        return new ResponseEntity<>(importService.createImport(file), HttpStatus.CREATED);
    }
}
