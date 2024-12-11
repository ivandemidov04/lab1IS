package itmo.infsys.controller;

import itmo.infsys.domain.dto.HumanDTO;
import itmo.infsys.service.HumanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/human")
public class HumanController {
    private final HumanService humanService;

    @Autowired
    public HumanController(HumanService humanService) {
        this.humanService = humanService;
    }

    @PostMapping
    public ResponseEntity<HumanDTO> createHuman(@RequestBody HumanDTO humanDTO) {
        return new ResponseEntity<>(humanService.createHuman(humanDTO), HttpStatus.CREATED);
    }

    @GetMapping("{id}")
    public ResponseEntity<HumanDTO> getHumanById(@PathVariable Long id) {
        return new ResponseEntity<>(humanService.getHumanById(id), HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<HumanDTO>> getAllHumans() {
        return new ResponseEntity<>(humanService.getAllHumans(), HttpStatus.OK);
    }

    @PutMapping("{id}")
    public ResponseEntity<HumanDTO> updateHuman(@PathVariable Long id, @RequestBody HumanDTO humanDTO) {
        return new ResponseEntity<>(humanService.updateHuman(id, humanDTO), HttpStatus.OK);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteHuman(@PathVariable Long id) {
        humanService.deleteHuman(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
