package itmo.infsys.service;

import itmo.infsys.domain.dto.CarDTO;
import itmo.infsys.domain.model.Car;
import itmo.infsys.domain.model.User;
import itmo.infsys.repository.CarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class CarService {
    private final CarRepository carRepository;
    private final UserService userService;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public CarService(CarRepository carRepository, UserService userService, SimpMessagingTemplate messagingTemplate) {
        this.carRepository = carRepository;
        this.userService = userService;
        this.messagingTemplate = messagingTemplate;
    }

    public CarDTO createCar(CarDTO carDTO) {
        User user = userService.getCurrentUser();
        Car car = new Car(carDTO.getCool(), user);
        Car savedCar = carRepository.save(car);
        //TODO: map cars to dtos, return current page, not all cars
        messagingTemplate.convertAndSend("/topic/car", carRepository.findAll());
        return mapCarToCarDTO(savedCar);
    }

    public CarDTO getCarById(Long id) {
        Car car = carRepository.findById(id).get();
        return mapCarToCarDTO(car);
    }

    public Page<CarDTO> getPageCars(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return mapCarsToCarDTOs(carRepository.findAll(pageable));
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
        messagingTemplate.convertAndSend("/topic/car", carRepository.findAll());
        return mapCarToCarDTO(updatedCar);
    }

    public void deleteCar(Long id) {
        Car car = carRepository.findById(id).orElseThrow(() -> new RuntimeException("Car not found"));
        User user = userService.getCurrentUser();
        if (!Objects.equals(car.getUser().getId(), user.getId())) {
            throw new RuntimeException("Car doesn't belong to this user");
        }
        carRepository.deleteById(id);
        messagingTemplate.convertAndSend("/topic/car", carRepository.findAll());
    }

    public CarDTO mapCarToCarDTO(Car car) {
        return new CarDTO(
                car.getId(),
                car.getCool(),
                car.getUser().getId()
        );
    }

    public Page<CarDTO> mapCarsToCarDTOs(Page<Car> carsPage) {
        List<CarDTO> carDTOs = new ArrayList<>();
        for (Car car : carsPage.getContent()) {
            carDTOs.add(mapCarToCarDTO(car));
        }
        return new PageImpl<>(carDTOs, carsPage.getPageable(), carsPage.getTotalElements());
    }
}
