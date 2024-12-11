package itmo.infsys.domain.dto;

import itmo.infsys.domain.model.User;

public class CoordDTO {
    public CoordDTO() {}

    public CoordDTO(Long id, Double x, Long y, User user) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getX() {
        return x;
    }

    public void setX(Double x) {
        this.x = x;
    }

    public Long getY() {
        return y;
    }

    public void setY(Long y) {
        this.y = y;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    private Long id;
    private Double x;
    private Long y;
    private User user;
}

