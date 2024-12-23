package itmo.infsys.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ImportDTO {
    private Long id;
    private String name;
    private Boolean status;
    private Long userId;
}
