package itmo.infsys.service;

import itmo.infsys.domain.dto.JoinDTO;
import itmo.infsys.domain.dto.UserDTO;
import itmo.infsys.domain.model.Join;
import itmo.infsys.repository.JoinRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import itmo.infsys.domain.model.Role;
import itmo.infsys.domain.model.User;
import itmo.infsys.repository.UserRepository;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final JoinRepository joinRepository;
    private final UserRepository userRepository;

    public User save(User user) {
        return userRepository.save(user);
    }

    public User create(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Пользователь с таким именем уже существует");
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Пользователь с таким email уже существует");
        }

        return save(user);
    }

    public User getByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Пользователь не найден"));

    }

    public UserDetailsService userDetailsService() {
        return this::getByUsername;
    }

    public User getCurrentUser() {
        var username = SecurityContextHolder.getContext().getAuthentication().getName();
        return getByUsername(username);
    }

    @Deprecated
    public void getAdmin() {
        var user = getCurrentUser();
        user.setRole(Role.ROLE_ADMIN);
        save(user);
    }

    public JoinDTO createJoin() {
        var user = getCurrentUser();
        Join join = new Join(
                userRepository.findById(user.getId()).get()
        );
        Join saved = joinRepository.save(join);
        return mapJoinToJoinDTO(saved);
    }

    public UserDTO approveJoin(Long id) {
        Join join = joinRepository.findById(id).get();
        User user = userRepository.findById(join.getUser().getId()).get();
        user.setRole(Role.ROLE_ADMIN);
        User updated = save(user);
        deleteJoin(id);
        return mapUserToUserDTO(updated);
    }

    public void deleteJoin(Long id) {
        joinRepository.deleteById(id);
    }

    public List<UserDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return mapUsersToUserDTOs(users);
    }

    public Page<JoinDTO> getPageJoins(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return mapJoinsToJoinDTOs(joinRepository.findAll(pageable));
    }

    public UserDTO mapUserToUserDTO(User user) {
        return new UserDTO(
                user.getId(),
                user.getUsername(),
                user.getPassword(),
                user.getEmail(),
                user.getRole()
        );
    }

    public List<UserDTO> mapUsersToUserDTOs(List<User> users) {
        List<UserDTO> userDTOs = new ArrayList<>();
        for (User user : users) {
            userDTOs.add(mapUserToUserDTO(user));
        }
        return userDTOs;
    }

    public JoinDTO mapJoinToJoinDTO(Join join) {
        return new JoinDTO(
                join.getId(),
                join.getUser().getId()
        );
    }

    public Page<JoinDTO> mapJoinsToJoinDTOs(Page<Join> joinsPage) {
        List<JoinDTO> joinDTOs = new ArrayList<>();
        for (Join join : joinsPage.getContent()) {
            joinDTOs.add(mapJoinToJoinDTO(join));
        }
        return new PageImpl<>(joinDTOs, joinsPage.getPageable(), joinsPage.getTotalElements());
    }
}
