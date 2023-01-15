import { MigrationInterface, QueryRunner } from "typeorm";

export class updateRelationTable1673767316608 implements MigrationInterface {
    name = 'updateRelationTable1673767316608'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_note" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "views" integer, "userId" integer)`);
        await queryRunner.query(`INSERT INTO "temporary_note"("id", "title", "description", "created_at", "updated_at", "deleted_at", "views", "userId") SELECT "id", "title", "description", "created_at", "updated_at", "deleted_at", "views", "userId" FROM "note"`);
        await queryRunner.query(`DROP TABLE "note"`);
        await queryRunner.query(`ALTER TABLE "temporary_note" RENAME TO "note"`);
        await queryRunner.query(`CREATE TABLE "temporary_note" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "views" integer, "user_id" integer)`);
        await queryRunner.query(`INSERT INTO "temporary_note"("id", "title", "description", "created_at", "updated_at", "deleted_at", "views", "user_id") SELECT "id", "title", "description", "created_at", "updated_at", "deleted_at", "views", "userId" FROM "note"`);
        await queryRunner.query(`DROP TABLE "note"`);
        await queryRunner.query(`ALTER TABLE "temporary_note" RENAME TO "note"`);
        await queryRunner.query(`CREATE TABLE "temporary_note" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "views" integer, "user_id" integer, CONSTRAINT "FK_654d6da35fcab12c3905725a416" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_note"("id", "title", "description", "created_at", "updated_at", "deleted_at", "views", "user_id") SELECT "id", "title", "description", "created_at", "updated_at", "deleted_at", "views", "user_id" FROM "note"`);
        await queryRunner.query(`DROP TABLE "note"`);
        await queryRunner.query(`ALTER TABLE "temporary_note" RENAME TO "note"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "note" RENAME TO "temporary_note"`);
        await queryRunner.query(`CREATE TABLE "note" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "views" integer, "user_id" integer)`);
        await queryRunner.query(`INSERT INTO "note"("id", "title", "description", "created_at", "updated_at", "deleted_at", "views", "user_id") SELECT "id", "title", "description", "created_at", "updated_at", "deleted_at", "views", "user_id" FROM "temporary_note"`);
        await queryRunner.query(`DROP TABLE "temporary_note"`);
        await queryRunner.query(`ALTER TABLE "note" RENAME TO "temporary_note"`);
        await queryRunner.query(`CREATE TABLE "note" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "views" integer, "userId" integer)`);
        await queryRunner.query(`INSERT INTO "note"("id", "title", "description", "created_at", "updated_at", "deleted_at", "views", "userId") SELECT "id", "title", "description", "created_at", "updated_at", "deleted_at", "views", "user_id" FROM "temporary_note"`);
        await queryRunner.query(`DROP TABLE "temporary_note"`);
        await queryRunner.query(`ALTER TABLE "note" RENAME TO "temporary_note"`);
        await queryRunner.query(`CREATE TABLE "note" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "views" integer, "userId" integer, CONSTRAINT "FK_5b87d9d19127bd5d92026017a7b" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "note"("id", "title", "description", "created_at", "updated_at", "deleted_at", "views", "userId") SELECT "id", "title", "description", "created_at", "updated_at", "deleted_at", "views", "userId" FROM "temporary_note"`);
        await queryRunner.query(`DROP TABLE "temporary_note"`);
    }

}
