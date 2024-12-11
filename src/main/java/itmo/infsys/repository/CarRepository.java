package itmo.infsys.repository;

import itmo.infsys.domain.model.Car;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CarRepository extends JpaRepository<Car, Long> {}
