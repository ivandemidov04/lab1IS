package itmo.infsys.service;

import itmo.infsys.domain.dto.CoordDTO;
import itmo.infsys.domain.model.Coord;
import itmo.infsys.domain.model.Role;
import itmo.infsys.domain.model.User;
import itmo.infsys.repository.CoordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class CoordService {
    private final CoordRepository coordRepository;
    private final UserService userService;
    private final SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    public CoordService(CoordRepository coordRepository, UserService userService, SimpMessagingTemplate simpMessagingTemplate) {
        this.coordRepository = coordRepository;
        this.userService = userService;
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    public CoordDTO createCoord(CoordDTO coordDTO) {
        User user = userService.getCurrentUser();
        Coord coord = new Coord(coordDTO.getX(), coordDTO.getY(), user);
        Coord savedCoord = coordRepository.save(coord);
        simpMessagingTemplate.convertAndSend("/topic/coord", coordRepository.findAll());
        return mapCoordToCoordDTO(savedCoord);
    }

    public CoordDTO getCoordById(Long id) {
        Coord coord = coordRepository.findById(id).get();
        return mapCoordToCoordDTO(coord);
    }

    public Page<CoordDTO> getPageCoords(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return mapCoordsToCoordDTOs(coordRepository.findAll(pageable));
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
        simpMessagingTemplate.convertAndSend("/topic/coord", coordRepository.findAll());
        return mapCoordToCoordDTO(updatedCoord);
    }

    public void deleteCoord(Long id) {
        Coord coord = coordRepository.findById(id).orElseThrow(() -> new RuntimeException("Coord not found"));
        User user = userService.getCurrentUser();
        if (user.getRole() != Role.ROLE_ADMIN && !Objects.equals(coord.getUser().getId(), user.getId())) {
            throw new RuntimeException("Coord doesn't belong to this user");
        }
        coordRepository.deleteById(id);
        simpMessagingTemplate.convertAndSend("/topic/coord", coordRepository.findAll());
    }

    public CoordDTO mapCoordToCoordDTO (Coord coord) {
        return new CoordDTO(
                coord.getId(),
                coord.getX(),
                coord.getY(),
                coord.getUser().getId()
        );
    }

    public Page<CoordDTO> mapCoordsToCoordDTOs(Page<Coord> coordsPage) {
        List<CoordDTO> coordDTOs = new ArrayList<>();
        for (Coord coord : coordsPage.getContent()) {
            coordDTOs.add(mapCoordToCoordDTO(coord));
        }
        return new PageImpl<>(coordDTOs, coordsPage.getPageable(), coordsPage.getTotalElements());
    }
}
