package itmo.infsys.domain.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "humans")
public class Human {
    public Human() {}

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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Coord getCoord() {
        return coord;
    }

    public void setCoord(Coord coord) {
        this.coord = coord;
    }

    public LocalDateTime getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(LocalDateTime creationDate) {
        this.creationDate = creationDate;
    }

    public Boolean getRealHero() {
        return realHero;
    }

    public void setRealHero(Boolean realHero) {
        this.realHero = realHero;
    }

    public Boolean getHasToothpick() {
        return hasToothpick;
    }

    public void setHasToothpick(Boolean hasToothpick) {
        this.hasToothpick = hasToothpick;
    }

    public Car getCar() {
        return car;
    }

    public void setCar(Car car) {
        this.car = car;
    }

    public Mood getMood() {
        return mood;
    }

    public void setMood(Mood mood) {
        this.mood = mood;
    }

    public Double getImpactSpeed() {
        return impactSpeed;
    }

    public void setImpactSpeed(Double impactSpeed) {
        this.impactSpeed = impactSpeed;
    }

    public WeaponType getWeaponType() {
        return weaponType;
    }

    public void setWeaponType(WeaponType weaponType) {
        this.weaponType = weaponType;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @Id
    @Column(name = "humans_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
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

    @OneToOne(fetch = FetchType.EAGER, optional = false)
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

