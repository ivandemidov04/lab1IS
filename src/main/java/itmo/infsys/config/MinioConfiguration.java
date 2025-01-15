package itmo.infsys.config;

import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.minio.MinioClient;

@Configuration
public class MinioConfiguration {

    @Value("${minio.url}")
    private String minioUrl;

    @Value("${minio.accessKey}")
    private String accessKey;

    @Value("${minio.secretKey}")
    private String secretKey;

    @Value("${minio.bucket-name}")
    private String bucketName;

    @Value("${minio.secure}")
    private Boolean minioSecure;

    @Bean
    public MinioClient minioClient() {
        // Убедитесь, что URL не заканчивается на слэш
        if (minioUrl.endsWith("/")) {
            minioUrl = minioUrl.substring(0, minioUrl.length() - 1);
        }

        MinioClient minioClient = MinioClient.builder()
                .credentials(accessKey, secretKey)
                .endpoint(minioUrl) // Порт указывается в URL
                .build();

        try {
            if (!minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build())) {
                minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
                System.out.println("Бакет был успешно создан: " + bucketName);
            } else {
                System.out.println("Бакет уже существует: " + bucketName);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return minioClient;
    }
}
