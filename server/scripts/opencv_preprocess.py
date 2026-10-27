import argparse
import json
import os
import sys

import cv2
import numpy as np


def build_steps():
    return [
        {"name": "opencv_read", "label": "OpenCV loaded image"},
        {"name": "opencv_grayscale", "label": "Converted to grayscale"},
        {"name": "opencv_denoise", "label": "Reduced noise"},
        {"name": "opencv_contrast", "label": "Enhanced contrast (CLAHE)"},
        {"name": "opencv_threshold", "label": "Applied adaptive threshold"},
        {"name": "opencv_deskew", "label": "Deskewed document"},
        {"name": "opencv_write", "label": "Saved preprocessed image"},
    ]


def deskew_image(image):
    inverted = cv2.bitwise_not(image)
    coordinates = np.column_stack(np.where(inverted > 0))
    if coordinates.size == 0:
        return image, 0.0

    angle = cv2.minAreaRect(coordinates)[-1]
    if angle < -45:
        angle = -(90 + angle)
    else:
        angle = -angle

    height, width = image.shape[:2]
    matrix = cv2.getRotationMatrix2D((width / 2, height / 2), angle, 1.0)
    rotated = cv2.warpAffine(
        image,
        matrix,
        (width, height),
        flags=cv2.INTER_CUBIC,
        borderMode=cv2.BORDER_REPLICATE,
    )
    return rotated, angle


def preprocess(input_path, output_path):
    image = cv2.imread(input_path)
    if image is None:
        raise RuntimeError("Failed to read input image for OpenCV preprocessing.")

    grayscale = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    denoised = cv2.fastNlMeansDenoising(grayscale, None, 20, 7, 21)

    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    contrast = clahe.apply(denoised)

    thresholded = cv2.adaptiveThreshold(
        contrast,
        255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY,
        31,
        11,
    )

    deskewed, angle = deskew_image(thresholded)

    kernel = np.ones((1, 1), np.uint8)
    cleaned = cv2.morphologyEx(deskewed, cv2.MORPH_OPEN, kernel)

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    ok = cv2.imwrite(output_path, cleaned)
    if not ok:
        raise RuntimeError("Failed to save OpenCV preprocessed image.")

    return angle


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()

    try:
        angle = preprocess(args.input, args.output)
        payload = {
            "ok": True,
            "steps": build_steps(),
            "deskew_angle": round(float(angle), 3),
            "output_path": args.output,
        }
        print(json.dumps(payload))
    except Exception as exc:
        payload = {"ok": False, "error": str(exc)}
        print(json.dumps(payload), file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
