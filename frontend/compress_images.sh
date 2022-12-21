#!/usr/bin/env bash

# Compress images in public/ to webp lossless 1080p 
# Requires cwebp from libwebp

# Usage: ./compress_images.sh

# Remove ".png" from the name of webp files
find public/ -type f -name "*.webp" -exec bash -c 'mv "$1" "${1%.png.webp}.webp"' - '{}' \;
# find public/ -type f -name "*.webp" -delete

# find public/ -type f -name "*.png" -exec cwebp -lossless -resize 0 1080 -o {}.webp {} \;