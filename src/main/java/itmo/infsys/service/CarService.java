package itmo.infsys.service;

import itmo.infsys.domain.dto.CarDTO;
import itmo.infsys.domain.model.Car;
import itmo.infsys.domain.model.User;
import itmo.infsys.repository.CarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class CarService {
    private final CarRepository carRepository;
    private final UserService userService;

    @Autowired
    public CarService(CarRepository carRepository, UserService userService) {
        this.carRepository = carRepository;
        this.userService = userService;
    }

    public CarDTO createCar(CarDTO carDTO) {
        User user = userService.getCurrentUser();
        Car car = new Car(carDTO.getCool(), user);
        Car savedCar = carRepository.save(car);
        return mapCarToCarDTO(savedCar);
    }

    public CarDTO getCarById(Long id) {
        Car car = carRepository.findById(id).get();
        return mapCarToCarDTO(car);
    }

    public List<CarDTO> getAllCars() {
        List<Car> cars = carRepository.findAll();
        return mapCarsToCarDTOs(cars);
    }

    public CarDTO updateCar(Long id, CarDTO carDTO) {
        Car car = carRepository.findById(id).orElseThrow(() -> new RuntimeException("Car not found"));
        User user = userService.getCurrentUser();
        if (!Objects.equals(car.getUser().getId(), user.getId())) {
            throw new RuntimeException("Car doesn't belong to this user");
        }
        car.setCool(carDTO.getCool());
        car.setUser(user);
        Car updatedCar = carRepository.save(car);
        return mapCarToCarDTO(updatedCar);
    }

    public void deleteCar(Long id) {
        Car car = carRepository.findById(id).orElseThrow(() -> new RuntimeException("Car not found"));
        User user = userService.getCurrentUser();
        if (!Objects.equals(car.getUser().getId(), user.getId())) {
            throw new RuntimeException("Car doesn't belong to this user");
        }
        carRepository.deleteById(id);
    }

    public CarDTO mapCarToCarDTO(Car car) {
        return new CarDTO(
                car.getId(),
                car.getCool(),
                car.getUser()
        );
    }

    public List<CarDTO> mapCarsToCarDTOs(List<Car> cars) {
        List<CarDTO> carDTOs = new ArrayList<>();
        for (Car car : cars) {
            carDTOs.add(mapCarToCarDTO(car));
        }
        return carDTOs;
    }
}

