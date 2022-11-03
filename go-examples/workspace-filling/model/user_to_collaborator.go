package model

import (
	"time"

	"github.com/google/uuid"
)

const (
	CollaborationTypeDefault = "default"
	CollaborationTypeManager = "manager"
)

// base entity
type UserToCollaborator struct {
	tableName struct{} `pg:"users_to_collaborators,alias:usr_2_clb"`

	ID                uuid.UUID `json:"id" pg:"id,pk,type:uuid,default:gen_random_uuid()"`
	CollaborationType string    `json:"collaboration_type"`
	CreatedAt         time.Time `json:"created_at" pg:"default:now()"`

	WorkspaceID    uuid.UUID  `json:"workspace_id"`
	Workspace      *Workspace `json:"workspace" pg:"rel:has-one"`
	UserID         uuid.UUID  `json:"user_id"`
	User           *User      `json:"user" pg:"rel:has-one"`
	CollaboratorID uuid.UUID  `json:"collaborator_id"`
	Collaborator   *User      `json:"collaborator" pg:"rel:has-one"`
}
