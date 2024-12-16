package itmo.infsys.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "coords")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Coord {
    @Id
    @Column(name = "coords_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "x", nullable = false)
    private Double x;

    @Column(name = "y")
    private Long y;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    public Coord(Double x, Long y, User user) {
        this.x = x;
        this.y = y;
        this.user = user;
    }
}

