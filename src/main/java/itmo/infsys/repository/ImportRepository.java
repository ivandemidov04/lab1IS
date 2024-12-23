package itmo.infsys.repository;

import itmo.infsys.domain.model.Import;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImportRepository extends JpaRepository<Import, Long> {
}
