package itmo.infsys.service;

import itmo.infsys.domain.dto.CoordDTO;
import itmo.infsys.domain.model.Car;
import itmo.infsys.domain.model.Coord;
import itmo.infsys.domain.model.User;
import itmo.infsys.repository.CoordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class CoordService {
    private final CoordRepository coordRepository;
    private final UserService userService;

    @Autowired
    public CoordService(CoordRepository coordRepository, UserService userService) {
        this.coordRepository = coordRepository;
        this.userService = userService;
    }

    public CoordDTO createCoord(CoordDTO coordDTO) {
        User user = userService.getCurrentUser();
        Coord coord = new Coord(coordDTO.getX(), coordDTO.getY(), user);
        Coord savedCoord = coordRepository.save(coord);
        return mapCoordToCoordDTO(savedCoord);
    }

    public CoordDTO getCoordById(Long id) {
        Coord coord = coordRepository.findById(id).get();
        return mapCoordToCoordDTO(coord);
    }

    public List<CoordDTO> getAllCoords() {
        List<Coord> coords = coordRepository.findAll();
        return mapCoordsToCoordDTOs(coords);
    }

    public Page<Coord> getPageCoords(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return coordRepository.findAll(pageable);
    }

    public CoordDTO updateCoord(Long id, CoordDTO coordDTO) {
        Coord coord = coordRepository.findById(id).orElseThrow(() -> new RuntimeException("Coord not found"));
        User user = userService.getCurrentUser();
        if (!Objects.equals(coord.getUser().getId(), user.getId())) {
            throw new RuntimeException("Coord doesn't belong to this user");
        }
        coord.setX(coordDTO.getX());
        coord.setY(coordDTO.getY());
        coord.setUser(user);
        Coord updatedCoord = coordRepository.save(coord);
        return mapCoordToCoordDTO(updatedCoord);
    }

    public void deleteCoord(Long id) {
        Coord coord = coordRepository.findById(id).orElseThrow(() -> new RuntimeException("Coord not found"));
        User user = userService.getCurrentUser();
        if (!Objects.equals(coord.getUser().getId(), user.getId())) {
            throw new RuntimeException("Coord doesn't belong to this user");
        }
        coordRepository.deleteById(id);
    }

    public CoordDTO mapCoordToCoordDTO (Coord coord) {
        return new CoordDTO(
                coord.getId(),
                coord.getX(),
                coord.getY(),
                coord.getUser()
        );
    }

    public List<CoordDTO> mapCoordsToCoordDTOs (List<Coord> coords) {
        List<CoordDTO> coordDTOs = new ArrayList<>();
        for (Coord coord : coords) {
            coordDTOs.add(mapCoordToCoordDTO(coord));
        }
        return coordDTOs;
    }
}
