#!/bin/bash

file="${1:-../.env}"
file_name=${file##*/}

if [ -f "$file" ]; then
    echo "$file_name already present. Skipping to the next step..."
else
    echo "$file_name does not exist. Creating it..."
cat << EOT >> $file
PORT=8081 # Port for the Go HTTP Server
HOST=localhost # Host/IP for the Go HTTP Server
EOT
    echo "$file_name created with default content."
fi

exit 0
