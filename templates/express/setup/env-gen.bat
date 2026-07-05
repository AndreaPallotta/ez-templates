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
        ECHO PORT=8081 # Must match the port exposed in the dockerfile. Remove for default: 8081
        ECHO HOST=localhost # Hostname/IP. Remove for default: localhost
        ECHO LOG_LEVEL=debug # Log Level Depth. Remove for default: 'debug' for dev and 'warn' for prod
        ECHO SECRET="%secret%"
        ECHO CACHE_TIME="2 minutes"
        ECHO SECURE_TESTS=true # Use JWTs in Jest unit tests
    ) > %file%
    ECHO %file_name% created with default content.
)

EXIT /b

