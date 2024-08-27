package com.gangsan21.cms.entity;

import com.gangsan21.cms.entity.primaryKey.FavoritePk;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "favorite")
@Table(name = "favorite")
@IdClass(FavoritePk.class) // Id 가 어떤 클래스를 따르는지 지정 (현재 복합키 상태이므로 PK 클래스 따로 생성: FavoritePk)
public class FavoriteEntity {
    @Id
    private String userEmail;

    @Id
    private Integer boardNumber;
}
