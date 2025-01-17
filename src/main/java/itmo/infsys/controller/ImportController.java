package itmo.infsys.controller;

import itmo.infsys.domain.dto.ImportDTO;
import itmo.infsys.service.ImportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import io.minio.GetObjectArgs;
import io.minio.MinioClient;

import java.io.InputStream;
import java.util.Map;

@RestController
@RequestMapping("/api/file")
public class ImportController {
    private final ImportService importService;
    private final MinioClient minioClient;

    @Value("${minio.bucket-name}")
    private String bucketName;

    @Autowired
    public ImportController(ImportService importService, MinioClient minioClient) {
        this.importService = importService;
        this.minioClient = minioClient;
    }

    @PostMapping("download")
    public ResponseEntity<byte[]> getFile(@RequestParam("id") String id, @RequestParam("filename") String filename) {
        String objectName = id + "_" + filename;
        try (InputStream stream = minioClient
                .getObject(GetObjectArgs.builder()
                        .bucket(bucketName)
                        .object(objectName)
                        .build())) {

            byte[] fileBytes = stream.readAllBytes();

            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + objectName);
            headers.add(HttpHeaders.CONTENT_TYPE, "application/octet-stream");

            return new ResponseEntity<>(fileBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/page")
    public Page<ImportDTO> getPageImports(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return importService.getPageImports(page, size);
    }

    @PostMapping("/import")
    public Boolean importFromFile (@RequestBody MultipartFile file) {
        importService.saveFile(file);
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
