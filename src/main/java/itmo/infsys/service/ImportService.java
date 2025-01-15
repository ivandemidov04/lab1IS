package itmo.infsys.service;

import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import itmo.infsys.domain.dto.ImportDTO;
import itmo.infsys.domain.model.*;
import itmo.infsys.repository.CarRepository;
import itmo.infsys.repository.CoordRepository;
import itmo.infsys.repository.HumanRepository;
import itmo.infsys.repository.ImportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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

import java.io.InputStream;
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
    private MinioClient minioClient;
    @Value("${minio.bucket-name}")
    private String bucketName;

    @Autowired
    public ImportService(ImportRepository importRepository, UserService userService, CarRepository carRepository,
                         CoordRepository coordRepository, HumanRepository humanRepository,
                         SimpMessagingTemplate simpMessagingTemplate, MinioClient minioClient) {
        this.importRepository = importRepository;
        this.userService = userService;
        this.carRepository = carRepository;
        this.coordRepository = coordRepository;
        this.humanRepository = humanRepository;
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.minioClient = minioClient;
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
            saveFile(file);
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
        Type listType = new TypeToken<List<Map<String, String>>>() {}.getType();
        List<Map<String, String>> jsonArray = gson.fromJson(content, listType);
        convertJsonToCitizenArray(jsonArray);
    }

    private void convertJsonToCitizenArray(List<Map<String, String>> json) throws Exception {
        for (int i = 0; i < json.size(); i++) {
            Coord coord = new Coord(json.get(i), userService.getCurrentUser());
            Coord savedCoord = coordRepository.save(coord);
            Car car = new Car(json.get(i), userService.getCurrentUser());
            Car savedCar = carRepository.save(car);
            Human human = new Human(json.get(i), savedCoord, savedCar, userService.getCurrentUser());
            humanRepository.save(human);
        }
    }

    private void saveFile(MultipartFile file) throws Exception {
//        String objectName = filenameID++ + "_" + file.getOriginalFilename();
        String objectName = file.getOriginalFilename();
        try {
            if (!minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build())) {
                minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
                System.out.println("Бакет был успешно создан: " + bucketName);
            }

            try (InputStream inputStream = file.getInputStream()) {
                minioClient.putObject(PutObjectArgs.builder().bucket(bucketName).object(objectName)
                        .stream(inputStream, -1, 10485760).build());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public Page<ImportDTO> getPageImports(int page, int size) {
        User user = userService.getCurrentUser();
        Pageable pageable = PageRequest.of(page, size);
        if (user.getRole() == Role.ROLE_ADMIN) {
            return mapImportsToImportDTOs(importRepository.findAll(pageable));
        } else {
            return mapImportsToImportDTOs(importRepository.findByUserId(user.getId(), pageable));
        }
    }

    public void deleteImport(Long id) {
        importRepository.deleteById(id);
    }

    public void deleteAllImports() {
        importRepository.deleteAll();
    }

    public ImportDTO mapImportToImportDTO(Import importt) {
        return new ImportDTO(
                importt.getId(),
                importt.getName(),
                importt.getStatus(),
                importt.getUser().getId()
        );
    }

    public Page<ImportDTO> mapImportsToImportDTOs(Page<Import> importsPage) {
        List<ImportDTO> importDTOs = new ArrayList<>();
        for (Import importt : importsPage.getContent()) {
            importDTOs.add(mapImportToImportDTO(importt));
        }
        return new PageImpl<>(importDTOs, importsPage.getPageable(), importsPage.getTotalElements());
    }
}
