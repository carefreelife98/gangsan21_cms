package com.gangsan21.cms.entity;

import com.gangsan21.cms.dto.request.board.PostCommentRequestDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.crypto.Cipher;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "comment")
@Table(name = "comment")
public class CommentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer commentNumber;

    private String content;
    private LocalDateTime writeDateTime;
    private String userEmail;
    private Integer boardNumber;

    public CommentEntity(PostCommentRequestDto dto, Integer boardNumber, String email) {

        String localDateTimeStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss"));
        LocalDateTime now = LocalDateTime.parse(localDateTimeStr);

        this.content = dto.getContent();
        this.writeDateTime = now;
        this.userEmail = email;
        this.boardNumber = boardNumber;
    }
}
