import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserTable1692082904212 implements MigrationInterface {
    name = 'UpdateUserTable1692082904212'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "access_token" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "refresh_token" DROP NOT NULL`);

        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "firstname" VARCHAR(255)`);
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "lastname" VARCHAR(255)`);
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "role" VARCHAR(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "lastname"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "firstname"`);

        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "refresh_token" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "access_token" SET NOT NULL`);
    }

}
