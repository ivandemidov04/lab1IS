package itmo.infsys.service;

import itmo.infsys.domain.model.Human;
import itmo.infsys.domain.model.Mood;
import itmo.infsys.domain.model.User;
import itmo.infsys.domain.model.WeaponType;
import itmo.infsys.repository.HumanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class FeatureService {
    private final HumanRepository humanRepository;
    private final UserService userService;

    @Autowired
    public FeatureService(HumanRepository humanRepository, UserService userService) {
        this.humanRepository = humanRepository;
        this.userService = userService;
    }

    public Map<String, Long> groupByName() {
        List<Human> humans = humanRepository.findAll();
        Map<String, Long> names = new HashMap<>();

        for (Human human : humans) {
            // Если имя уже есть в мапе, увеличиваем значение на 1
            if (names.containsKey(human.getName())) {
                names.put(human.getName(), names.get(human.getName()) + 1);
            } else {
                // Если имени нет в мапе, добавляем с значением 1
                names.put(human.getName(), 1L);
            }
        }
        return names;
    }

    public Long getEqualWeaponType(WeaponType weaponType) {
        List<Human> humans = humanRepository.findAll();
        Long result = 0L;
        for (Human human : humans) {
            if (human.getWeaponType() == weaponType) {
                result += 1;
            }
        }
        return result;
    }

    public Set<Double> uniqueImpactSpeed() {
        List<Human> humans = humanRepository.findAll();
        Set<Double> impact = new HashSet<>();
        for (Human human : humans) {
            impact.add(human.getImpactSpeed());
        }
        return impact;
    }

    public void deleteNoToothpicks() {
        List<Human> humans = humanRepository.findAll();
        User user = userService.getCurrentUser();
        for (Human human : humans) {
            if (Objects.equals(human.getUser().getId(), user.getId()) && !human.getHasToothpick()) {
                humanRepository.delete(human);
            }
        }
    }

    public void makeAllSad() {
        List<Human> humans = humanRepository.findAll();
        User user = userService.getCurrentUser();
        for (Human human : humans) {
            if (Objects.equals(human.getUser().getId(), user.getId())) {
                human.setMood(Mood.SADNESS);
                humanRepository.save(human);
            }
        }
    }
}
