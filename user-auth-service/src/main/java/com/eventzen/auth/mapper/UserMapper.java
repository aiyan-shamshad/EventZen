package com.eventzen.auth.mapper;

import com.eventzen.auth.dto.UserResponse;
import com.eventzen.auth.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    UserResponse toResponse(User user);

    List<UserResponse> toResponseList(List<User> users);
}
