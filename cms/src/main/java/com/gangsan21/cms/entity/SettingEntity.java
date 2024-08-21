package com.gangsan21.cms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "setting")
@Table(name = "setting")
public class SettingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long settingNumber;

    @Column(columnDefinition = "VARCHAR(30)", nullable = false)
    private String userEmail;

    @Setter
    @Column(columnDefinition = "VARCHAR(20)")
    private String alarmPeriod;

}
