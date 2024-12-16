package itmo.infsys.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CoordDTO {
    private Long id;
    private Double x;
    private Long y;
    private Long userId;
}

