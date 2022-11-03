package model

import (
	"time"

	"github.com/google/uuid"
)

// Base entity
type Workspace struct {
	tableName struct{} `pg:"workspaces,alias:wsp"`

	ID                uuid.UUID `json:"id" pg:"id,pk,type:uuid,default:gen_random_uuid()"`
	Name              string    `json:"name"`
	Code              string    `json:"code"`
	CollaborationLink string    `json:"collaboration_link"`
	CreatedByID       uuid.UUID `json:"created_by_id" pg:"default:now()"`
	CreatedAt         time.Time `json:"created_at" pg:"default:now()"`
	UpdatedAt         time.Time `json:"updated_at"`

	Users []User `pg:"rel:has-many"`
}
