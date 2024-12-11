package itmo.infsys.service;

import itmo.infsys.domain.dto.HumanDTO;
import itmo.infsys.domain.model.Car;
import itmo.infsys.domain.model.Coord;
import itmo.infsys.domain.model.Human;
import itmo.infsys.domain.model.User;
import itmo.infsys.repository.CarRepository;
import itmo.infsys.repository.CoordRepository;
import itmo.infsys.repository.HumanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class HumanService {
    private final HumanRepository humanRepository;
    private final CoordRepository coordRepository;
    private final CarRepository carRepository;
    private final UserService userService;

    @Autowired
    public HumanService(HumanRepository humanRepository, CoordRepository coordRepository, CarRepository carRepository, UserService userService) {
        this.humanRepository = humanRepository;
        this.coordRepository = coordRepository;
        this.carRepository = carRepository;
        this.userService = userService;
    }

    public HumanDTO createHuman(HumanDTO humanDTO) {
        User user = userService.getCurrentUser();
        Coord coord = coordRepository.findById(humanDTO.getCoord().getId()).get();
        Car car = carRepository.findById(humanDTO.getCar().getId()).get();
        if (!Objects.equals(coord.getUser().getId(), user.getId())) {
            throw new RuntimeException("Coord doesn't belong to this user");
        }
        if (!Objects.equals(car.getUser().getId(), user.getId())) {
            throw new RuntimeException("Car doesn't belong to this user");
        }
        Human human = new Human(
                humanDTO.getName(),
                coord,
                humanDTO.getRealHero(),
                humanDTO.getHasToothpick(),
                car,
                humanDTO.getMood(),
                humanDTO.getImpactSpeed(),
                humanDTO.getWeaponType(),
                user
        );
        Human humanSaved = humanRepository.save(human);
        return mapHumanToHumanDTO(humanSaved);
    }

    public HumanDTO getHumanById(Long id) {
        Human human = humanRepository.findById(id).get();
        return mapHumanToHumanDTO(human);
    }

    public List<HumanDTO> getAllHumans() {
        List<Human> humans = humanRepository.findAll();
        return mapHumansToHumanDTOs(humans);
    }

    public HumanDTO updateHuman(Long id, HumanDTO humanDTO) {
        Human human = humanRepository.findById(id).orElseThrow(() -> new RuntimeException("Human not found"));
        User user = userService.getCurrentUser();
        if (!Objects.equals(human.getUser().getId(), user.getId())) {
            throw new RuntimeException("Human doesn't belong to this user");
        }
        Coord coord = coordRepository.findById(humanDTO.getCoord().getId()).get();
        if (!Objects.equals(coord.getUser().getId(), user.getId())) {
            throw new RuntimeException("Coord doesn't belong to this user");
        }
        Car car = carRepository.findById(humanDTO.getCar().getId()).get();
        if (!Objects.equals(car.getUser().getId(), user.getId())) {
            throw new RuntimeException("Car doesn't belong to this user");
        }
        human.setName(humanDTO.getName());
        human.setCoord(coord);
        human.setRealHero(humanDTO.getRealHero());
        human.setHasToothpick(humanDTO.getHasToothpick());
        human.setCar(car);
        human.setMood(humanDTO.getMood());
        human.setImpactSpeed(humanDTO.getImpactSpeed());
        human.setUser(user);
        Human humanUpdated = humanRepository.save(human);
        return mapHumanToHumanDTO(humanUpdated);
    }

    public void deleteHuman(Long id) {
        Human human = humanRepository.findById(id).orElseThrow(() -> new RuntimeException("Human not found"));
        User user = userService.getCurrentUser();
        if (!Objects.equals(human.getUser().getId(), user.getId())) {
            throw new RuntimeException("Human doesn't belong to this user");
        }
        humanRepository.deleteById(id);
    }

    public HumanDTO mapHumanToHumanDTO(Human human) {
        HumanDTO humanDTO =  new HumanDTO(
                human.getId(),
                human.getName(),
                human.getCoord(),
                human.getCreationDate(),
                human.getRealHero(),
                human.getHasToothpick(),
                human.getCar(),
                human.getMood(),
                human.getImpactSpeed(),
                human.getWeaponType(),
                human.getUser()
        );
        return humanDTO;
    }

    public List<HumanDTO> mapHumansToHumanDTOs(List<Human> humans) {
        List<HumanDTO> humansDTOs = new ArrayList<>();
        for (Human human : humans) {
            humansDTOs.add(mapHumanToHumanDTO(human));
        }
        return humansDTOs;
    }
}

