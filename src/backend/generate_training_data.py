import os
import random
from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageFilter

def generate_image(char, font_path, font_size, color, angle, noise_level):
    """Generates an image of a single character with variations."""
    try:
        font = ImageFont.truetype(font_path, font_size)
    except IOError:
        print(f"Error loading font: {font_path}")
        return None

    # Determine text size
    # Use textbbox for more accurate size calculation
    bbox = font.getbbox(char)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    # Create a blank image with padding
    padding = 10
    img_width = text_width + 2 * padding
    img_height = text_height + 2 * padding
    img = Image.new('RGB', (img_width, img_height), color='white')
    d = ImageDraw.Draw(img)

    # Draw text
    # Adjust position based on bbox to center the text
    text_x = padding - bbox[0]
    text_y = padding - bbox[1]
    d.text((text_x, text_y), char, fill=color, font=font)

    # Apply rotation
    if angle != 0:
        img = img.rotate(angle, expand=True, fillcolor='white')

    # Apply noise (simple pixel noise)
    if noise_level > 0:
        pixels = img.load()
        for i in range(img.size[0]):
            for j in range(img.size[1]):
                if random.random() < noise_level:
                    pixels[i, j] = (random.randint(0, 255), random.randint(0, 255), random.randint(0, 255))

    return img

def generate_dataset(
    ttf_folder,
    output_folder,
    characters='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    font_sizes=[20, 30, 40],
    colors=[(0, 0, 0), (255, 0, 0), (0, 0, 255)], # Black, Red, Blue
    angles=[-10, 0, 10], # -10, 0, +10 degrees
    noise_levels=[0, 0.01, 0.05], # No noise, low noise, medium noise
    num_samples_per_char=10
):
    """Generates a dataset of character images from TTF files."""
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    ttf_files = [f for f in os.listdir(ttf_folder) if f.endswith('.ttf')]
    if not ttf_files:
        print(f"No TTF files found in {ttf_folder}")
        return

    for char in characters:
        char_output_folder = os.path.join(output_folder, char)
        if not os.path.exists(char_output_folder):
            os.makedirs(char_output_folder)

        for _ in range(num_samples_per_char):
            font_file = random.choice(ttf_files)
            font_path = os.path.join(ttf_folder, font_file)
            font_size = random.choice(font_sizes)
            color = random.choice(colors)
            angle = random.choice(angles)
            noise_level = random.choice(noise_levels)

            img = generate_image(char, font_path, font_size, color, angle, noise_level)
            if img:
                # Create a unique filename
                filename = f"{char}_{os.path.splitext(font_file)[0]}_{font_size}_{angle}_{noise_level}_{random.randint(1000, 9999)}.png"
                img_path = os.path.join(char_output_folder, filename)
                img.save(img_path)
                # print(f"Generated {img_path}")

    print(f"Dataset generation complete. Images saved to {output_folder}")

if __name__ == '__main__':
    ttf_folder = 'd:\\桌面\\monv\\ttf'
    output_folder = 'd:\\桌面\\monv\\training_data'
    generate_dataset(ttf_folder, output_folder)