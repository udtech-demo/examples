package jwt

import (
	"github.com/labstack/echo/v4"
	"net/http"
)

var (
	ErrInternalServerError = echo.NewHTTPError(http.StatusInternalServerError, http.StatusText(http.StatusInternalServerError))
	ErrUnauthorized        = echo.NewHTTPError(http.StatusUnauthorized, http.StatusText(http.StatusUnauthorized))
)
