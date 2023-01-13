import { MigrationInterface, QueryRunner } from "typeorm";

export class updateViewsToNullable1673632213244 implements MigrationInterface {
    name = 'updateViewsToNullable1673632213244'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_note" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "views" integer NOT NULL)`);
        await queryRunner.query(`INSERT INTO "temporary_note"("id", "title", "description", "created_at", "updated_at", "deleted_at", "views") SELECT "id", "title", "description", "created_at", "updated_at", "deleted_at", "views" FROM "note"`);
        await queryRunner.query(`DROP TABLE "note"`);
        await queryRunner.query(`ALTER TABLE "temporary_note" RENAME TO "note"`);
        await queryRunner.query(`CREATE TABLE "temporary_note" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "views" integer)`);
        await queryRunner.query(`INSERT INTO "temporary_note"("id", "title", "description", "created_at", "updated_at", "deleted_at", "views") SELECT "id", "title", "description", "created_at", "updated_at", "deleted_at", "views" FROM "note"`);
        await queryRunner.query(`DROP TABLE "note"`);
        await queryRunner.query(`ALTER TABLE "temporary_note" RENAME TO "note"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "note" RENAME TO "temporary_note"`);
        await queryRunner.query(`CREATE TABLE "note" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "views" integer NOT NULL)`);
        await queryRunner.query(`INSERT INTO "note"("id", "title", "description", "created_at", "updated_at", "deleted_at", "views") SELECT "id", "title", "description", "created_at", "updated_at", "deleted_at", "views" FROM "temporary_note"`);
        await queryRunner.query(`DROP TABLE "temporary_note"`);
        await queryRunner.query(`ALTER TABLE "note" RENAME TO "temporary_note"`);
        await queryRunner.query(`CREATE TABLE "note" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "views" integer NOT NULL)`);
        await queryRunner.query(`INSERT INTO "note"("id", "title", "description", "created_at", "updated_at", "deleted_at", "views") SELECT "id", "title", "description", "created_at", "updated_at", "deleted_at", "views" FROM "temporary_note"`);
        await queryRunner.query(`DROP TABLE "temporary_note"`);
    }

}
