package itmo.infsys.controller;

import itmo.infsys.domain.dto.HumanDTO;
import itmo.infsys.domain.model.Coord;
import itmo.infsys.domain.model.Human;
import itmo.infsys.service.HumanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
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

    @GetMapping("/page")
    public Page<HumanDTO> getPageHumans(
                                      @RequestParam(defaultValue = "0") int page,
                                      @RequestParam(defaultValue = "10") int size) {
        return humanService.getPageHumans(page, size);
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
