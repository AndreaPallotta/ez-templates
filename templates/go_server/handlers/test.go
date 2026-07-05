package handlers

import (
	"encoding/json"
	"log/slog"
	"net/http"
)

type TokenResponse struct {
	AuthToken    string `json:"authToken"`
	RefreshToken string `json:"refreshToken"`
}

type PostRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func TestGet(w http.ResponseWriter, r *http.Request) {
	username := r.PathValue("username")
	slog.Debug("GET /test/test-get/", slog.String("username", username))

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusNotFound)
	json.NewEncoder(w).Encode(map[string]string{"error": "Data not found"})
}

func TestPost(w http.ResponseWriter, r *http.Request) {
	if r.Header.Get("Content-Type") != "application/json" {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid Content-Type"})
		return
	}

	var req PostRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil || req.Email == "" || req.Password == "" {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid Fields"})
		return
	}

	// Mock token generation
	resp := TokenResponse{
		AuthToken:    "mock_go_jwt_auth_token_xyz",
		RefreshToken: "mock_go_jwt_refresh_token_abc",
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(resp)
}
