#!/bin/bash

file="${1:-../.env}"
file_name=${file##*/}

secret=$(node -e "console.log(require('crypto').randomBytes(256).toString('base64'));")

if [ -f "$file" ]; then
    echo "$file_name already present. Skipping to the next step..."
else
    echo "$file_name does not exist. Creating it..."
cat << EOT >> $file
PORT=8081 # Must match the port exposed in the dockerfile. Remove for default: 8081
HOST=localhost # Hostname/IP. Remove for default: localhost
LOG_LEVEL=debug # Log Level Depth. Remove for default: 'debug' for dev and 'warn' for prod
SECRET="$secret"
CACHE_TIME="2 minutes"
SECURE_TESTS=true # Use JWTs in Jest unit tests
EOT
    echo "$file_name created with default content."
fi

exit 0

