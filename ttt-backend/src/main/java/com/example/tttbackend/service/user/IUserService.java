package com.example.tttbackend.service.user;

import com.example.tttbackend.model.user.User;

import java.util.List;

public interface IUserService {
    User createUser(User user);

    User getUser(String username);

    List<User> getUsers();
}
