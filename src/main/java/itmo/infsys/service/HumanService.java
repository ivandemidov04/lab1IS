package itmo.infsys.service;

import itmo.infsys.domain.dto.CoordDTO;
import itmo.infsys.domain.dto.HumanDTO;
import itmo.infsys.domain.dto.NestedHumanDTO;
import itmo.infsys.domain.model.*;
import itmo.infsys.repository.CarRepository;
import itmo.infsys.repository.CoordRepository;
import itmo.infsys.repository.HumanRepository;
import itmo.infsys.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

@Service
public class HumanService {
    private final HumanRepository humanRepository;
    private final CoordRepository coordRepository;
    private final CarRepository carRepository;
    private final UserService userService;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    public HumanService(HumanRepository humanRepository, CoordRepository coordRepository, CarRepository carRepository, UserService userService, UserRepository userRepository, SimpMessagingTemplate simpMessagingTemplate) {
        this.humanRepository = humanRepository;
        this.coordRepository = coordRepository;
        this.carRepository = carRepository;
        this.userService = userService;
        this.userRepository = userRepository;
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    public HumanDTO createHuman(HumanDTO humanDTO) {
        User user = userService.getCurrentUser();
        Coord coord = coordRepository.findById(humanDTO.getCoordId()).get();
        Car car = carRepository.findById(humanDTO.getCarId()).get();
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
        simpMessagingTemplate.convertAndSend("/topic/human", humanRepository.findAll());
        return mapHumanToHumanDTO(humanSaved);
    }

    public HumanDTO createNestedHuman(NestedHumanDTO nestedHumanDTO) {
        User user = userService.getCurrentUser();
        Coord coord = coordRepository.save(new Coord(nestedHumanDTO.getCoord().getX(), nestedHumanDTO.getCoord().getY(), user));
        Car car = carRepository.save(new Car(nestedHumanDTO.getCar().getCool(), user));
        Human human = new Human(
                nestedHumanDTO.getName(),
                coord,
                nestedHumanDTO.getRealHero(),
                nestedHumanDTO.getHasToothpick(),
                car,
                nestedHumanDTO.getMood(),
                nestedHumanDTO.getImpactSpeed(),
                nestedHumanDTO.getWeaponType(),
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
        return mapHumansToHumanDTOsList(humanRepository.findAll());
    }

    public Page<HumanDTO> getPageHumans(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return mapHumansToHumanDTOs(humanRepository.findAll(pageable));
    }

    public HumanDTO updateHuman(Long id, HumanDTO humanDTO) {
        Human human = humanRepository.findById(id).orElseThrow(() -> new RuntimeException("Human not found"));
        User user = userService.getCurrentUser();
        if (!Objects.equals(human.getUser().getId(), user.getId())) {
            throw new RuntimeException("Human doesn't belong to this user");
        }
        Coord coord = coordRepository.findById(humanDTO.getCoordId()).get();
        if (!Objects.equals(coord.getUser().getId(), user.getId())) {
            throw new RuntimeException("Coord doesn't belong to this user");
        }
        Car car = carRepository.findById(humanDTO.getCarId()).get();
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
        simpMessagingTemplate.convertAndSend("/topic/human", humanRepository.findAll());
        return mapHumanToHumanDTO(humanUpdated);
    }

    public void deleteHuman(Long id) {
        Human human = humanRepository.findById(id).orElseThrow(() -> new RuntimeException("Human not found"));
        User user = userService.getCurrentUser();
        if (user.getRole() != Role.ROLE_ADMIN && !Objects.equals(human.getUser().getId(), user.getId())) {
            throw new RuntimeException("Human doesn't belong to this user");
        }
        humanRepository.deleteById(id);
        simpMessagingTemplate.convertAndSend("/topic/human", humanRepository.findAll());
    }

    public HumanDTO mapHumanToHumanDTO(Human human) {
        HumanDTO humanDTO =  new HumanDTO(
                human.getId(),
                human.getName(),
                human.getCoord().getId(),
                human.getCreationDate(),
                human.getRealHero(),
                human.getHasToothpick(),
                human.getCar().getId(),
                human.getMood(),
                human.getImpactSpeed(),
                human.getWeaponType(),
                human.getUser().getId()
        );
        return humanDTO;
    }

    public Page<HumanDTO> mapHumansToHumanDTOs(Page<Human> humansPage) {
        List<HumanDTO> humansDTOs = new ArrayList<>();
        for (Human human : humansPage.getContent()) {
            humansDTOs.add(mapHumanToHumanDTO(human));
        }
        return new PageImpl<>(humansDTOs, humansPage.getPageable(), humansPage.getTotalElements());
    }

    public List<HumanDTO> mapHumansToHumanDTOsList(List<Human> humans) {
        List<HumanDTO> humanDTOs = new ArrayList<>();
        for (Human human : humans) {
            humanDTOs.add(mapHumanToHumanDTO(human));
        }
        return humanDTOs;
    }
}
