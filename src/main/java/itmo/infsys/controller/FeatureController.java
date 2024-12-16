package itmo.infsys.controller;

import itmo.infsys.domain.model.WeaponType;
import itmo.infsys.service.FeatureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/feature")
public class FeatureController {
    private final FeatureService featureService;

    @Autowired
    public FeatureController(FeatureService featureService) {
        this.featureService = featureService;
    }

    @GetMapping("/group-by-name")
    public ResponseEntity<Map<String, Long>> groupByName() {
        return new ResponseEntity<>(featureService.groupByName(), HttpStatus.OK);
    }

    @GetMapping("/get-equal-weapon-type")
    public ResponseEntity<Long> getEqualWeaponType(@RequestParam String weaponType) {
        return new ResponseEntity<>(featureService.getEqualWeaponType(WeaponType.valueOf(weaponType)), HttpStatus.OK);
    }

    @GetMapping("/unique-impact-speed")
    public ResponseEntity<Set<Double>> uniqueImpactSpeed() {
        return new ResponseEntity<>(featureService.uniqueImpactSpeed(), HttpStatus.OK);
    }

    @DeleteMapping("/delete-no-toothpicks")
    public ResponseEntity<Void> deleteNoToothpicks() {
        featureService.deleteNoToothpicks();
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/make-all-sad")
    public ResponseEntity<Void> makeAllSad() {
        featureService.makeAllSad();
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }
}
