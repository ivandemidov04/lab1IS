package itmo.infsys.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "imports")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Import {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "status")
    private Boolean status;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    public Import(String name, Boolean status, User currentUser) {
        this.name = name;
        this.status = status;
        this.user = currentUser;
    }
}
