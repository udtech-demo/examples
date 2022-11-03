package model

import (
	"github.com/google/uuid"
)

type UserToGroup struct {
	tableName struct{} `pg:"users_to_groups,alias:usr_2_grp"`

	ID      uuid.UUID `json:"id" pg:"id,pk,type:uuid,default:gen_random_uuid()"`
	UserID  uuid.UUID `json:"user_id" pg:",pk"`
	User    *User     `json:"user" pg:"rel:has-one"`
	GroupID uuid.UUID `json:"group_id" pg:",pk"`
	Group   *Group    `json:"group" pg:"rel:has-one"`
}
