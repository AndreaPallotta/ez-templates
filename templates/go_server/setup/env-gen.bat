@echo off

set "file=%~1"
if "%file%"=="" set "file=..\.env"

if exist "%file%" (
    echo .env already present. Skipping to next step...
) else (
    echo .env does not exist. Creating it...
    (
        echo PORT=8081
        echo HOST=localhost
    ) > "%file%"
    echo .env created with default content.
)

exit /b 0
