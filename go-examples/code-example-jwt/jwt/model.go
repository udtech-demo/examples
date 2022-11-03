package jwt

import (
	"github.com/google/uuid"
	"github.com/kataras/jwt"
)

// AccessTokenData context session data
type AccessTokenData struct {
	AtID        uuid.UUID `json:"at_id"`
	SessionUUID uuid.UUID `json:"session_uuid"`

	UserUUID uuid.UUID `json:"user_uuid"`

	CreatedAtUnixNano int64 `json:"created_at"`
	SessionExpAt      int64 `json:"session_exp_at"`
	jwt.Claims
}

type SessionDetails struct {
	SessionID    uuid.UUID
	AccessToken  string
	RefreshToken string
	AtID         uuid.UUID
	RtID         uuid.UUID
	AtExpires    int64
	RtExpires    int64
	SessionExpAt int64
}

type AccessTokenDetails struct {
	AccessToken string
	AtID        uuid.UUID
	AtExpires   int64
}

// RefreshTokenData information about refresh token
type RefreshTokenData struct {
	RtID uuid.UUID `json:"rt_id" `

	SessionUUID uuid.UUID `json:"session_uuid"`
	UserUUID    uuid.UUID `json:"user_uuid"`

	CreatedAtUnixNano int64 `json:"created_at"`
	SessionExpAt      int64 `json:"session_exp_at"`
	jwt.Claims
}
