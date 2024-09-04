package com.gangsan21.cms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "image")
@Table(name = "image")
public class ImageEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer sequence;

    private Integer boardNumber;

    @Column(columnDefinition = "TEXT")
    private String image;

    public ImageEntity(int boardNumber, String imageUrl) {
        this.boardNumber = boardNumber;
        this.image = imageUrl;
    }
}
