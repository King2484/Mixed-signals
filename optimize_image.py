import os
from PIL import Image

def optimize_image(input_path, output_path, max_dimension=1600, quality=80):
    try:
        img = Image.open(input_path)
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
        
        width, height = img.size
        # Resize if larger than max_dimension
        if max(width, height) > max_dimension:
            if width > height:
                new_width = max_dimension
                new_height = int(height * (max_dimension / width))
            else:
                new_height = max_dimension
                new_width = int(width * (max_dimension / height))
            
            img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
        
        # Save as optimized JPEG
        img.save(output_path, "JPEG", optimize=True, quality=quality)
        print(f"Optimized: {output_path} (Size: {os.path.getsize(output_path) // 1024} KB)")

    except Exception as e:
        print(f"Failed to optimize {input_path}: {e}")

if __name__ == "__main__":
    base_path = r"c:\Users\DanielUshie\Downloads\mixed-signals-nextjs\mixed-signals\public"
    input_file = os.path.join(base_path, "IMG-20260309-WA0006.jpg")
    output_file = os.path.join(base_path, "IMG-20260309-WA0006-opt.jpg")
    
    if os.path.exists(input_file):
        optimize_image(input_file, output_file)
    else:
        print("Input file not found.")
