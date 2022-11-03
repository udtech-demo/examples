package main

import (
	"code-example-jwt/jwt"
	"github.com/google/uuid"
	"github.com/labstack/gommon/log"
	"time"
)

func main() {
	// Make jwt configurator
	jc := jwt.NewJwtConfigurator(1*time.Second, 2*time.Second, 3*time.Second)

	// Create token pair
	userUUID := uuid.New()
	sessionUUID := uuid.New()

	sessionDetails, err := jc.CreateTokenPair(userUUID, sessionUUID, 0)
	if err != nil {
		log.Error(err)
	}

	log.Infof("AccessToken: %s", sessionDetails.AccessToken)
	log.Infof("RefreshToken: %s", sessionDetails.RefreshToken)

	// Validate access token
	accessTokenDetails, err := jc.ValidateAccessToken(sessionDetails.AccessToken)
	if err != nil {
		log.Error(err)
	}

	log.Infof("User uuid form token: %s", accessTokenDetails.UserUUID)

	// Wait 1 second
	time.Sleep(2 * time.Second)

	// Validate expired access token
	accessTokenDetails, err = jc.ValidateAccessToken(sessionDetails.AccessToken)
	log.Infof("err: %v", err)
	log.Infof("accessTokenDetails: %v", accessTokenDetails)
}
