package itmo.infsys.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "humans")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Human {
    @Id
    @Column(name = "humans_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "coords_id")
    private Coord coord;

    @Column(name = "creation_date", nullable = false, updatable = false )
    private LocalDateTime creationDate;

    @Column(name = "real_hero")
    private Boolean realHero;

    @Column(name = "has_toothpick")
    private Boolean hasToothpick;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "cars_id")
    private Car car;

    @Column(name = "mood", nullable = false)
    @Enumerated(EnumType.STRING)
    private Mood mood;

    @Column(name = "impact_speed", nullable = false)
    private Double impactSpeed;

    @Column(name = "weapon_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private WeaponType weaponType;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    public Human(String name, Coord coord, Boolean realHero, Boolean hasToothpick, Car car, Mood mood, Double impactSpeed, WeaponType weaponType, User user) {
        this.name = name;
        this.coord = coord;
        this.realHero = realHero;
        this.hasToothpick = hasToothpick;
        this.car = car;
        this.mood = mood;
        this.impactSpeed = impactSpeed;
        this.weaponType = weaponType;
        this.user = user;
    }

    public Human(Map<String, String> json, Coord coord, Car car, User user) throws Exception {
        this.name = json.get("name");
        this.coord = coord;
        this.realHero = Boolean.parseBoolean(json.get("realHero"));
        this.hasToothpick = Boolean.parseBoolean(json.get("hasToothpick"));
        this.car = car;
        this.mood = Mood.valueOf(json.get("mood"));
        this.impactSpeed = Double.parseDouble(json.get("impactSpeed"));
        this.weaponType = WeaponType.valueOf(json.get("weaponType"));
        this.user = user;
    }

    @PrePersist
    private void prePersist() {
        setCreationDate();
        validateName();
        validateImpactSpeed();
    }

    @PreUpdate
    private void preUpdate() {
        validateName();
        validateImpactSpeed();
    }

    private void setCreationDate(){
        this.creationDate = LocalDateTime.now();
    }

    private void validateName(){
        if(name.isEmpty()){
            throw new IllegalArgumentException("Значение имени не может быть пустым");
        }
    }

    private void validateImpactSpeed(){
        if(impactSpeed > 29.0){
            throw new IllegalArgumentException("Значение impactSpeed должно быть не больше 29");
        }
    }
}

