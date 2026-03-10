import sys
import subprocess
import os

print("Installing dependencies...")
subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow", "imageio-ffmpeg"])
import imageio_ffmpeg
from PIL import Image

def process_logo():
    print("Processing logo to remove white background...")
    img = Image.open("public/preview.webp").convert("RGBA")
    datas = img.getdata()
    newData = []
    for item in datas:
        # Make white and near-white pixels perfectly transparent
        if item[0] > 230 and item[1] > 230 and item[2] > 230:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)
    img.putdata(newData)
    img.save("public/preview-transparent.png", "PNG")
    print("Logo processed to public/preview-transparent.png")

def process_video():
    print("Processing video using bundled FFmpeg...")
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    
    # Encode to H.264 mp4, high quality, ensure it plays correctly
    cmd = [
        ffmpeg_exe,
        "-y",
        "-i", "public/hero-video.mov",
        "-c:v", "libx264",
        "-preset", "slow",
        "-crf", "18", # High quality
        "-c:a", "aac",
        "-b:a", "192k",
        "-pix_fmt", "yuv420p", # Essential for widely compatible playback
        "-movflags", "+faststart", # Better for web playback
        "public/hero-video.mp4"
    ]
    subprocess.check_call(cmd)
    print("Video processed to public/hero-video.mp4")

if __name__ == "__main__":
    process_logo()
    process_video()
    print("Done")
