package itmo.infsys.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Map;

@Entity
@Table(name = "cars")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Car {
    @Id
    @Column(name = "cars_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cool", nullable = false)
    private Boolean cool;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    public Car(Boolean cool, User user) {
        this.cool = cool;
        this.user = user;
    }

    public Car(Map<String, String> json, User user) {
        this.cool = Boolean.parseBoolean(json.get("cool"));
        this.user = user;
    }
}
