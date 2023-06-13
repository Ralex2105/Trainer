package ru.ralex2105.trainer.image;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.io.Serializable;

@Data
@AllArgsConstructor
public class ImageResponse implements Serializable {
    String info;
}
