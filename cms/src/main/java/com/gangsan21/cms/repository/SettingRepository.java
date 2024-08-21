package com.gangsan21.cms.repository;

import com.gangsan21.cms.entity.SettingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SettingRepository extends JpaRepository<SettingEntity, Long> {
    SettingEntity findByUserEmail(String email);
}
