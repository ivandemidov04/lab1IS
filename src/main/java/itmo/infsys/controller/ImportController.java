package itmo.infsys.controller;

import itmo.infsys.domain.dto.ImportDTO;
import itmo.infsys.service.ImportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

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

    @PostMapping("/import")
    public Boolean importFromFile (@RequestParam("file") MultipartFile file) {
        return importService.importFromFile(file);
    }

    @PostMapping
    public ResponseEntity<ImportDTO> createImport(@RequestParam("filename") String filename, @RequestParam("status") Boolean status) {
        return new ResponseEntity<>(importService.createImport(filename, status), HttpStatus.CREATED);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<ImportDTO> deleteImport(@PathVariable Long id) {
        importService.deleteImport(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping("all")
    public ResponseEntity<ImportDTO> deleteAllImports() {
        importService.deleteAllImports();
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
