package itmo.infsys.controller;

import itmo.infsys.domain.dto.JoinDTO;
import itmo.infsys.domain.dto.UserDTO;
import itmo.infsys.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin-panel")
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("join")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<JoinDTO> createJoin() {
        return new ResponseEntity<>(userService.createJoin(), HttpStatus.CREATED);
    }

    @GetMapping("users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return new ResponseEntity<>(userService.getAllUsers(), HttpStatus.OK);
    }

    @GetMapping("page")
    @PreAuthorize("hasRole('ADMIN')")
    public Page<JoinDTO> getPageJoins(
                                     @RequestParam(defaultValue = "0") int page,
                                     @RequestParam(defaultValue = "10") int size) {
        return userService.getPageJoins(page, size);
    }

    @PutMapping("{id}")//join id
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDTO> approveJoin(@PathVariable Long id) {
        return new ResponseEntity<>(userService.approveJoin(id), HttpStatus.OK);
    }

    @DeleteMapping("{id}")//join id
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteJoin(@PathVariable Long id) {
        userService.deleteJoin(id);
    }
}
