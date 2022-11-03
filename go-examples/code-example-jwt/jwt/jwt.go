package jwt

import (
	"crypto/rsa"
	"github.com/google/uuid"
	"github.com/kataras/jwt"
	"github.com/labstack/gommon/log"
	"io/ioutil"
	"os"
	"time"
)

var (
	path, getWdErr = os.Getwd()
	privateKey     = path + "/rsa_keys/private_key.pem"
	publicKey      = path + "/rsa_keys/public_key.pem"
)

type jwtConfigurator struct {
	accessTokenDur  time.Duration
	refreshTokenDur time.Duration
	sessionMaxAge   time.Duration
	signer          *rsa.PrivateKey
	verifier        *rsa.PublicKey
	signingMethod   jwt.Alg
}

type Configurator interface {
	CreateTokenPair(userUUID, sessionUUID uuid.UUID, sessionExpAt int64) (*SessionDetails, error)
	ValidateAccessToken(token string) (*AccessTokenData, error)
	ValidateRefreshToken(token string) (*RefreshTokenData, error)
}

func NewJwtConfigurator(accessTokenDur, refreshTokenDur, sessionMaxAge time.Duration) Configurator {
	if accessTokenDur <= 0 {
		panic("accessTokenDur <= 0")
	}

	if accessTokenDur >= refreshTokenDur {
		panic("accessTokenDur > refreshTokenDur")
	}

	if refreshTokenDur >= sessionMaxAge {
		panic("refreshTokenDur > sessionMaxAge")
	}

	if getWdErr != nil {
		panic(getWdErr)
	}

	signBytes, err := ioutil.ReadFile(privateKey)
	if err != nil {
		panic(err)
	}

	signKey, err := jwt.ParsePrivateKeyRSA(signBytes)
	if err != nil {
		panic(err)
	}

	verifyBytes, err := ioutil.ReadFile(publicKey)
	if err != nil {
		panic(err)
	}

	verifyKey, err := jwt.ParsePublicKeyRSA(verifyBytes)
	if err != nil {
		panic(err)
	}

	return &jwtConfigurator{
		accessTokenDur:  accessTokenDur,
		refreshTokenDur: refreshTokenDur,
		sessionMaxAge:   sessionMaxAge,
		signer:          signKey,
		verifier:        verifyKey,
		signingMethod:   jwt.RS256,
	}
}

func (jc *jwtConfigurator) CreateTokenPair(userUUID, sessionUUID uuid.UUID, sessionExpAt int64) (*SessionDetails, error) {
	// 1. Resolve lifetime
	now := time.Now()
	acExp := now.Add(jc.accessTokenDur).Unix()
	rtExp := now.Add(jc.refreshTokenDur).Unix()

	// Set new session exp at if it 0
	if sessionExpAt == 0 {
		sessionExpAt = now.Add(jc.sessionMaxAge).Unix()
	}

	// Set sessionExpAt to access token exp at if lifetime more then session lifetime
	if acExp > sessionExpAt {
		acExp = sessionExpAt
	}

	// Set sessionExpAt to refresh token exp at if lifetime more then session lifetime
	if rtExp > sessionExpAt {
		rtExp = sessionExpAt
	}

	// 2. Make access and refresh claims
	accessClaims := AccessTokenData{
		AtID:        uuid.New(),
		SessionUUID: sessionUUID,
		UserUUID:    userUUID,

		CreatedAtUnixNano: now.UnixNano(),
		SessionExpAt:      sessionExpAt,

		Claims: jwt.Claims{
			Expiry: acExp, // The expiration time after which the token must be disregarded.
			//IssuedAt:  now.Unix(), // The time at which the token was issued.
			//NotBefore: now.Unix(), // The time before which the token must be disregarded.
		},
	}

	refreshClaims := RefreshTokenData{
		RtID: uuid.New(),

		SessionUUID: sessionUUID,
		UserUUID:    userUUID,

		CreatedAtUnixNano: now.UnixNano(),
		SessionExpAt:      sessionExpAt,

		Claims: jwt.Claims{
			Expiry: rtExp, // The expiration time after which the token must be disregarded.
			//IssuedAt:  now.Unix(), // The time at which the token was issued.
			//NotBefore: now.Unix(), // The time before which the token must be disregarded.
		},
	}

	// 3. Make tokens
	acToken, err := jwt.Sign(jc.signingMethod, jc.signer, accessClaims)
	if err != nil {
		log.Error(err)
		return nil, ErrInternalServerError
	}

	rtToken, err := jwt.Sign(jc.signingMethod, jc.signer, refreshClaims)
	if err != nil {
		log.Error(err)
		return nil, ErrInternalServerError
	}

	tokens := SessionDetails{
		SessionID:    sessionUUID,
		AccessToken:  string(acToken),
		RefreshToken: string(rtToken),
		AtID:         accessClaims.AtID,
		RtID:         refreshClaims.RtID,
		AtExpires:    acExp,
		RtExpires:    rtExp,
		SessionExpAt: sessionExpAt,
	}

	return &tokens, nil
}

func (jc *jwtConfigurator) ValidateAccessToken(token string) (*AccessTokenData, error) {
	// Verify and extract claims from a token:
	verifiedToken, err := jwt.Verify(jc.signingMethod, jc.verifier, []byte(token))
	if err != nil {
		return nil, ErrUnauthorized
	}

	var claims AccessTokenData
	err = verifiedToken.Claims(&claims)
	if err != nil {
		return nil, ErrInternalServerError
	}

	return &claims, nil
}

func (jc *jwtConfigurator) ValidateRefreshToken(token string) (*RefreshTokenData, error) {
	// Verify and extract claims from a token:
	verifiedToken, err := jwt.Verify(jc.signingMethod, jc.verifier, []byte(token))
	if err != nil {
		return nil, ErrUnauthorized
	}

	var claims RefreshTokenData
	err = verifiedToken.Claims(&claims)
	if err != nil {
		return nil, ErrInternalServerError
	}

	return &claims, nil
}
