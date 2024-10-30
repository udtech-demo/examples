import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserTable1692081718020 implements MigrationInterface {
    name = 'UpdateUserTable1692081718020'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "access_token_expires_in" integer`);
        await queryRunner.query(`ALTER TABLE "users" ADD "access_token_expires_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "users" ADD "refresh_token_expires_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "refresh_token_expires_at"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "access_token_expires_at"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "access_token_expires_in"`);
    }

}
