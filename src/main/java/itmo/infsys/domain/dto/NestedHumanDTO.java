package itmo.infsys.domain.dto;

import itmo.infsys.domain.model.Mood;
import itmo.infsys.domain.model.WeaponType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class NestedHumanDTO {
    private Long id;
    private String name;
    private CoordDTO coord;
    private LocalDateTime creationDate;
    private Boolean realHero;
    private Boolean hasToothpick;
    private CarDTO car;
    private Mood mood;
    private Double impactSpeed;
    private WeaponType weaponType;
    private Long userId;
}
