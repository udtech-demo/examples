package main

import (
	"fmt"
	"github.com/brianvoe/gofakeit/v6"
	"github.com/go-pg/pg/v10"
	"github.com/google/uuid"
	"strconv"
	"time"
	"workspace-filling/model"
	"workspace-filling/postgres"
)

type FillingSettings struct {
	WorkspaceID uuid.UUID
	UserCount   int
	GroupNames  []string
}

func main() {
	db := postgres.InitPostgres()
	tx, err := db.Begin()
	if err != nil {
		return
	}
	defer tx.Close()

	settings := FillingSettings{
		WorkspaceID: uuid.MustParse("cd443a62-e5ca-403e-900a-73ecdc2a458f"),
		UserCount:   1000,
		GroupNames: []string{
			"Officers",
			"Sales Leads",
			"Operations",
			"Sales Managers",
		},
	}

	grpAfterInsert, err := InsertGroups(tx, settings.WorkspaceID, settings.GroupNames)
	if err != nil {
		tx.Rollback()
		fmt.Println(err)
		return
	}

	usrAftInsert, err := InsertUser(tx, settings.WorkspaceID, settings.UserCount)
	if err != nil {
		tx.Rollback()
		fmt.Println(err)
		return
	}

	err = InsertGroupUserRelations(tx, usrAftInsert, grpAfterInsert)
	if err != nil {
		tx.Rollback()
		fmt.Println(err)
		return
	}

	err = InsertCollaborationUserRelations(tx, settings.WorkspaceID, usrAftInsert)
	if err != nil {
		tx.Rollback()
		fmt.Println(err)
		return
	}

	tx.Commit()
}

func InsertGroups(tx *pg.Tx, wspID uuid.UUID, groupNames []string) ([]model.Group, error) {
	var grpsForInsert []model.Group
	for _, grpName := range groupNames {
		grpsForInsert = append(grpsForInsert, model.Group{
			Name:        grpName,
			WorkspaceID: wspID,
		})
	}

	_, err := tx.Model(&grpsForInsert).Insert()
	if err != nil {
		return nil, err
	}

	var grpAfterInsert []model.Group
	err = tx.Model(&grpAfterInsert).Where("workspace_id = ?", wspID).Select()
	if err != nil {
		return nil, err
	}

	return grpAfterInsert, nil
}

func InsertUser(tx *pg.Tx, wspID uuid.UUID, usrCount int) ([]model.User, error) {
	var usrsForInsert []model.User
	for i := 1; i <= usrCount; i++ {
		hiringDate := gofakeit.DateRange(
			time.Date(2021, time.January, 1, 0, 0, 0, 0, time.UTC),
			time.Date(2022, time.January, 1, 0, 0, 0, 0, time.UTC),
		)
		hiringDateWithoutHour := time.Date(hiringDate.Year(), hiringDate.Month(), hiringDate.Day(), 0, 0, 0, 0, hiringDate.Location())

		usrsForInsert = append(usrsForInsert, model.User{
			FirstName:   gofakeit.FirstName(),
			LastName:    gofakeit.LastName(),
			Email:       gofakeit.Email(),
			PayrollID:   strconv.Itoa(gofakeit.Number(1, 64000)),
			WorkspaceID: wspID,
			PhoneCode:   "+1",
			Phone:       gofakeit.Numerify("##########"),
			HiringDate:  hiringDateWithoutHour,
		})
	}

	_, err := tx.Model(&usrsForInsert).Insert()
	if err != nil {
		return nil, err
	}

	var usrsAftInsert []model.User
	err = tx.Model(&usrsAftInsert).Where("workspace_id = ?", wspID).Select()
	if err != nil {
		return nil, err
	}

	return usrsForInsert, nil
}

func InsertGroupUserRelations(tx *pg.Tx, usrAftInsert []model.User, grpAfterInsert []model.Group) error {
	var usrsToGroupsForInsert []model.UserToGroup

	for _, usr := range usrAftInsert {
		if gofakeit.Number(0, 100) < 30 {
			usrsToGroupsForInsert = append(usrsToGroupsForInsert, model.UserToGroup{
				UserID:  usr.ID,
				GroupID: grpAfterInsert[gofakeit.Number(0, len(grpAfterInsert)-1)].ID,
			})
		}
	}

	_, err := tx.Model(&usrsToGroupsForInsert).Insert()
	if err != nil {
		return err
	}

	return nil
}

func InsertCollaborationUserRelations(tx *pg.Tx, wspID uuid.UUID, usrAftInsert []model.User) error {
	// [target][source]
	usrClbsMapBool := make(map[uuid.UUID]map[uuid.UUID]bool)
	usrClbsMapUsr := make(map[uuid.UUID]map[uuid.UUID]model.User)
	var usrClbs []model.UserToCollaborator

	for _, usr := range usrAftInsert {
		// maximum number of collaborations
		maxClb := 7

		if gofakeit.Number(0, 100) < 30 {
			maxClb--

			// search for a collaborations by user id
			for _, usrClbToUsr := range usrClbsMapUsr[usr.ID] {
				usrClbs = append(usrClbs, model.UserToCollaborator{
					UserID:            usr.ID,
					CollaboratorID:    usrClbToUsr.ID,
					CollaborationType: model.CollaborationTypeDefault,
					WorkspaceID:       wspID,
				})
				break
			}
		}

		var isHaveManager bool
		if gofakeit.Number(0, 100) < 30 {
			isHaveManager = true
		}

		for i := 1; i <= gofakeit.Number(0, maxClb); i++ {
			// Choosing a random user, and checking that he would not be repeated
			num := gofakeit.Number(0, len(usrAftInsert)-1)
			for usrClbsMapBool[usrAftInsert[num].ID][usr.ID] || usr.ID == usrAftInsert[num].ID {
				num = gofakeit.Number(0, len(usrAftInsert)-1)
			}

			// initialization user collaboration maps
			if usrClbsMapBool[usrAftInsert[num].ID] == nil {
				usrClbsMapBool[usrAftInsert[num].ID] = make(map[uuid.UUID]bool)
			}
			if usrClbsMapUsr[usrAftInsert[num].ID] == nil {
				usrClbsMapUsr[usrAftInsert[num].ID] = make(map[uuid.UUID]model.User)
			}

			usrClbsMapBool[usrAftInsert[num].ID][usr.ID] = true
			usrClbsMapUsr[usrAftInsert[num].ID][usr.ID] = usr

			var clbType string
			if isHaveManager && i == 1 {
				clbType = model.CollaborationTypeManager
			} else {
				clbType = model.CollaborationTypeDefault
			}

			usrClbs = append(usrClbs, model.UserToCollaborator{
				UserID:            usr.ID,
				CollaboratorID:    usrAftInsert[num].ID,
				CollaborationType: clbType,
				WorkspaceID:       wspID,
			})
		}
	}

	_, err := tx.Model(&usrClbs).Insert()
	if err != nil {
		return err
	}

	return nil
}
