package itmo.infsys.controller;

import itmo.infsys.domain.dto.CoordDTO;
import itmo.infsys.domain.model.Car;
import itmo.infsys.domain.model.Coord;
import itmo.infsys.service.CoordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coord")
public class CoordController {
    private final CoordService coordService;

    @Autowired
    public CoordController(CoordService coordService) {
        this.coordService = coordService;
    }

    @PostMapping
    public ResponseEntity<CoordDTO> createCoord(@RequestBody CoordDTO coordDTO) {
        return new ResponseEntity<>(coordService.createCoord(coordDTO), HttpStatus.CREATED);
    }

    @GetMapping("{id}")
    public ResponseEntity<CoordDTO> getCoordById(@PathVariable Long id) {
        return new ResponseEntity<>(coordService.getCoordById(id), HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<CoordDTO>> getAllCoords() {
        return new ResponseEntity<>(coordService.getAllCoords(), HttpStatus.OK);
    }

    @GetMapping("/page")
    public Page<Coord> getPageCoords( // TODO: should be CarDTO
                                    @RequestParam(defaultValue = "0") int page,
                                    @RequestParam(defaultValue = "10") int size) {
        return coordService.getPageCoords(page, size);
    }

    @PutMapping("{id}")
    public ResponseEntity<CoordDTO> updateCoord(@PathVariable Long id, @RequestBody CoordDTO coordDTO) {
        return new ResponseEntity<>(coordService.updateCoord(id, coordDTO), HttpStatus.OK);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteCoord(@PathVariable Long id) {
        coordService.deleteCoord(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}

