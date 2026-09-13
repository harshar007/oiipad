import os
from PIL import Image, ImageDraw, ImageFont

def generate_logo():
    assets_dir = os.path.join(os.path.dirname(__file__), 'assets')
    os.makedirs(assets_dir, exist_ok=True)
    
    # 512x512 Master Icon
    size = 512
    img = Image.new('RGBA', (size, size), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)
    
    # Rounded purple squircle background (Google Devs Style)
    bg_color = (103, 80, 164) # Google Material 3 Purple (#6750A4)
    draw.rounded_rectangle([32, 32, size-32, size-32], radius=110, fill=bg_color)
    
    # Inner subtle glow outline
    draw.rounded_rectangle([32, 32, size-32, size-32], radius=110, outline=(147, 51, 234), width=6)
    
    # Draw Game Controller Body (White)
    # Controller main body
    draw.rounded_rectangle([110, 170, 402, 330], radius=50, fill=(255, 255, 255))
    # Controller left grip
    draw.polygon([(110, 240), (145, 395), (200, 370), (180, 240)], fill=(255, 255, 255))
    # Controller right grip
    draw.polygon([(402, 240), (367, 395), (312, 370), (332, 240)], fill=(255, 255, 255))
    
    # D-pad (Purple)
    draw.rectangle([160, 225, 210, 245], fill=(103, 80, 164))
    draw.rectangle([175, 210, 195, 260], fill=(103, 80, 164))
    
    # Action Buttons (Purple)
    draw.ellipse([320, 205, 340, 225], fill=(103, 80, 164)) # Top (Y)
    draw.ellipse([345, 230, 365, 250], fill=(103, 80, 164)) # Right (B)
    draw.ellipse([320, 255, 340, 275], fill=(103, 80, 164)) # Bottom (A)
    draw.ellipse([295, 230, 315, 250], fill=(103, 80, 164)) # Left (X)
    
    # Center Gyro Motion Waves (Tilt symbol)
    draw.arc([220, 200, 292, 272], start=210, end=330, fill=(103, 80, 164), width=5)
    draw.arc([220, 200, 292, 272], start=30, end=150, fill=(103, 80, 164), width=5)
    draw.ellipse([251, 231, 261, 241], fill=(103, 80, 164))
    
    # Save icon.png, logo.png, favicon.png
    icon_path = os.path.join(assets_dir, 'icon.png')
    logo_path = os.path.join(assets_dir, 'logo.png')
    favicon_path = os.path.join(assets_dir, 'favicon.png')
    
    img.save(icon_path, 'PNG')
    img.save(logo_path, 'PNG')
    img.resize((64, 64), Image.Resampling.LANCZOS).save(favicon_path, 'PNG')
    print("Logo assets generated successfully!")

if __name__ == '__main__':
    generate_logo()
