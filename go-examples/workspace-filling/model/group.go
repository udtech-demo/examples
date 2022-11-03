package model

import (
	"time"

	"github.com/google/uuid"
)

// Base entity
type Group struct {
	tableName struct{} `pg:"groups,alias:grp"`

	ID          uuid.UUID `json:"id" pg:"id,pk,type:uuid,default:gen_random_uuid()"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at" pg:"default:now()"`
	UpdatedAt   time.Time `json:"updated_at"`

	WorkspaceID uuid.UUID  `json:"workspace_id"`
	Workspace   *Workspace `json:"workspace" pg:"rel:has-one"`

	Users []User `json:"users" pg:"many2many:users_to_groups"`
}
