package itmo.infsys.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import itmo.infsys.service.UserService;

@RestController
@RequestMapping("/api/example")
@RequiredArgsConstructor
public class ExampleController {
    private final UserService userService;

    @GetMapping
    public String example() {
        return "Hello, world!";
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public String exampleAdmin() {
        return "Hello, admin!";
    }

    @PostMapping("/admin")
    @PreAuthorize("hasRole('USER')")
    public String exampleAdminn() {
        return "Hello, user!";
    }

    @GetMapping("/get-admin")
    public void getAdmin() {
        userService.getAdmin();
    }
}