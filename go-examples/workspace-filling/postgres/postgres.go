package postgres

import (
	"context"
	"fmt"
	"github.com/go-pg/pg/v10"
)

type dbLogger struct{}

func (d dbLogger) BeforeQuery(c context.Context, q *pg.QueryEvent) (context.Context, error) {
	return c, nil
}

func (d dbLogger) AfterQuery(c context.Context, q *pg.QueryEvent) error {
	req, _ := q.FormattedQuery()
	fmt.Println(string(req))
	return nil
}

func InitPostgres() *pg.DB {
	var (
		host = "localhost"
		port = ":5436"
		user = "postgres"
		pass = "12345"
		name = "test"
	)

	db := pg.Connect(&pg.Options{
		Addr:     host + port,
		User:     user,
		Password: pass,
		Database: name,
	})
	ctx := context.Background()
	if err := db.Ping(ctx); err != nil {
		panic(err)
	}

	//db.AddQueryHook(dbLogger{})

	return db
}
