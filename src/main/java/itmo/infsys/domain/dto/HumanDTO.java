package itmo.infsys.domain.dto;

import itmo.infsys.domain.model.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class HumanDTO {
    private Long id;
    private String name;
    private Long coordId;
    private LocalDateTime creationDate;
    private Boolean realHero;
    private Boolean hasToothpick;
    private Long carId;
    private Mood mood;
    private Double impactSpeed;
    private WeaponType weaponType;
    private Long userId;
}

