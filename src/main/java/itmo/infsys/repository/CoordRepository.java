package itmo.infsys.repository;

import itmo.infsys.domain.model.Coord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CoordRepository extends JpaRepository<Coord, Long> {}

