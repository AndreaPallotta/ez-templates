#!/bin/bash

file="${1:-../.env}"
file_name=${file##*/}

secret=$(node -e "console.log(require('crypto').randomBytes(256).toString('base64'));")

if [ -f "$file" ]; then
    echo "$file_name already present. Skipping to the next step..."
else
    echo "$file_name does not exist. Creating it..."
cat << EOT >> $file
VITE_APP_NAME="Template" # Name of the application
VITE_APP_HOST="localhost" # Client's hostname/ip
VITE_APP_PORT=8080 # Client's port
VITE_SERVER_HOST="localhost" # Server's hostname/ip
VITE_SERVER_PORT=8081 # Server's port
VITE_USE_HTTPS="false" # Use HTTPS
VITE_USE_JWT="false" # Use JWT
EOT
    echo "$file_name created with default content."
fi

exit 0

