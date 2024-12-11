package itmo.infsys.repository;

import itmo.infsys.domain.model.Join;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JoinRepository extends JpaRepository<Join, Long> {
}
