package itmo.infsys.domain.dto;

import itmo.infsys.domain.model.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JoinDTO {
    private Long id;
    private Long userId;
}
