package itmo.infsys.repository;

import itmo.infsys.domain.model.Human;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HumanRepository extends JpaRepository<Human, Long> {}

