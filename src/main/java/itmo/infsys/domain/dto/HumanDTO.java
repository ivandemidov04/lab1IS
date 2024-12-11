package itmo.infsys.domain.dto;

import itmo.infsys.domain.model.*;

import java.time.LocalDateTime;

public class HumanDTO {
    public HumanDTO() {}

    public HumanDTO(Long id, String name, Coord coord, LocalDateTime creationDate, Boolean realHero, Boolean hasToothpick, Car car, Mood mood, Double impactSpeed, WeaponType weaponType, User user) {
        this.id = id;
        this.name = name;
        this.coord = coord;
        this.creationDate = creationDate;
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

    private Long id;
    private String name;
    private Coord coord;
    private LocalDateTime creationDate;
    private Boolean realHero;
    private Boolean hasToothpick;
    private Car car;
    private Mood mood;
    private Double impactSpeed;
    private WeaponType weaponType;
    private User user;
}

