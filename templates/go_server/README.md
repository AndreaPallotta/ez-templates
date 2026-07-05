# Go HTTP API Server Template

A clean, modern, secure REST API template written in Go using standard library `net/http` features (compatible with Go 1.22+).

## Features

- **Standard Library Only**: High-performance HTTP server using standard `net/http` ServeMux.
- **Structured Logging**: Native JSON logging via `log/slog`.
- **Graceful Shutdown**: Listens for system interruption signals to clean up connections gracefully.
- **REST Endpoints**: Includes pre-configured test GET/POST endpoints.

## Running

Start the server using `go run`:

```sh
go run main.go
```
