package itmo.infsys.domain.dto;

import itmo.infsys.domain.model.User;

public class CarDTO {
    public CarDTO() {}

    public CarDTO(Long id, Boolean cool, User user) {
        this.id = id;
        this.cool = cool;
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getCool() {
        return cool;
    }

    public void setCool(Boolean cool) {
        this.cool = cool;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    private Long id;
    private Boolean cool;
    private User user;
}

