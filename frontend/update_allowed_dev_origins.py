# This script finds your current local IP and updates .env.local for Next.js allowedDevOrigins
import os
import socket

# Get local IP address
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
try:
    s.connect(('10.255.255.255', 1))
    local_ip = s.getsockname()[0]
except Exception:
    local_ip = '127.0.0.1'
finally:
    s.close()

# Path to .env.local
env_path = os.path.join(os.path.dirname(__file__), '.env.local')

origins = [
    f'http://localhost:3000',
    f'http://{local_ip}:3000',
    f'https://localhost:3000',
    f'https://{local_ip}:3000',
]
allowed_origins_line = f'ALLOWED_DEV_ORIGINS={','.join(origins)}\n'

# Write or overwrite ALLOWED_DEV_ORIGINS
with open(env_path, 'w') as f:
    f.write(allowed_origins_line)

print(f"Set ALLOWED_DEV_ORIGINS to {','.join(origins)} in .env.local")
