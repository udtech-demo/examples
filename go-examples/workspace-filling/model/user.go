package model

import (
	"time"

	"github.com/google/uuid"
)

// Base entity
type User struct {
	tableName struct{} `pg:"users,alias:usr"`

	ID         uuid.UUID `json:"id" pg:"id,pk,type:uuid,default:gen_random_uuid()"`
	MaskedID   int       `json:"masked_id"`
	FirstName  string    `json:"first_name"`
	LastName   string    `json:"last_name"`
	Email      string    `json:"email"`
	PhoneCode  string    `json:"phone_code"`
	Phone      string    `json:"phone"`
	PayrollID  string    `json:"payroll_id"`
	HiringDate time.Time `json:"hiring_date"`
	CreatedAt  time.Time `json:"created_at" pg:"default:now()"`
	UpdatedAt  time.Time `json:"updated_at"`

	WorkspaceID uuid.UUID  `json:"workspace_id"`
	Workspace   *Workspace `json:"workspace" pg:"rel:has-one"`

	Groups []Group `json:"groups" pg:"many2many:users_to_groups"`
}
