package com.gangsan21.cms.repository;

import com.gangsan21.cms.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, String> {
    // JpaRepository <어떤 Entity, 해당 Entity 의 PK type>

    boolean existsByEmail(String email);
    boolean existsByNickName(String nickName);
    boolean existsByTelNumber(String telNumber);

    UserEntity findByEmail(String email);

}
