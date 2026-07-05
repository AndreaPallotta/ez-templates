@ECHO OFF

SET "file=%1"
IF NOT DEFINED file SET "file=..\.env"

CALL :sub %file%
EXIT /b

:sub
SET "file_name=%~nx1"

FOR /F "tokens=*" %%g IN ('node -e "console.log(require('crypto').randomBytes(256).toString('base64'));"') DO (SET secret=%%g)

IF EXIST %file% (
    ECHO %file_name% already present. Skipping...
) else (
    ECHO %file_name% does not exist. Creating it...
    (
        ECHO VITE_APP_NAME="Template" # Name of the application
        ECHO VITE_APP_HOST="localhost" # Client's hostname/ip
        ECHO VITE_APP_PORT=8080 # Client's port
        ECHO VITE_SERVER_HOST="localhost" # Server's hostname/ip
        ECHO VITE_SERVER_PORT=8081 # Server's port
        ECHO VITE_USE_HTTPS="false" # Use HTTPS
        ECHO VITE_USE_JWT="false" # Use JWT
    ) > %file%
    ECHO %file_name% created with default content.
)

EXIT /b

