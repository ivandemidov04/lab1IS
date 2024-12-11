package itmo.infsys.controller;

import itmo.infsys.domain.dto.JoinDTO;
import itmo.infsys.domain.dto.UserDTO;
import itmo.infsys.domain.model.Role;
import itmo.infsys.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
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
//    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<JoinDTO> createJoin() {
        return new ResponseEntity<>(userService.createJoin(), HttpStatus.CREATED);
    }

    @GetMapping("/get-admin")
    public void getAdmin() {
        userService.getAdmin();
    }

    @GetMapping("users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return new ResponseEntity<>(userService.getAllUsers(), HttpStatus.OK);
    }

    @GetMapping("joins")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<JoinDTO>> getAllJoins() {
        return new ResponseEntity<>(userService.getAllJoins(), HttpStatus.OK);
    }

    @PutMapping("{id}")//join id
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDTO> updateAdminJoinRequest(@PathVariable Long id, @RequestBody Boolean status) {
        return new ResponseEntity<>(userService.updateJoin(id, status), HttpStatus.OK);
    }
}
