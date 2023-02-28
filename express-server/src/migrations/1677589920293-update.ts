import { MigrationInterface, QueryRunner } from "typeorm";

export class update1677589920293 implements MigrationInterface {
    name = 'update1677589920293'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_image" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "url" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "note_id" integer)`);
        await queryRunner.query(`INSERT INTO "temporary_image"("id", "url", "created_at", "updated_at", "note_id") SELECT "id", "url", "created_at", "updated_at", "note_id" FROM "image"`);
        await queryRunner.query(`DROP TABLE "image"`);
        await queryRunner.query(`ALTER TABLE "temporary_image" RENAME TO "image"`);
        await queryRunner.query(`CREATE TABLE "temporary_image" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "url" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "note_id" integer, CONSTRAINT "FK_2960a5f766c3b7e447856efb71e" FOREIGN KEY ("note_id") REFERENCES "note" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_image"("id", "url", "created_at", "updated_at", "note_id") SELECT "id", "url", "created_at", "updated_at", "note_id" FROM "image"`);
        await queryRunner.query(`DROP TABLE "image"`);
        await queryRunner.query(`ALTER TABLE "temporary_image" RENAME TO "image"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "image" RENAME TO "temporary_image"`);
        await queryRunner.query(`CREATE TABLE "image" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "url" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "note_id" integer)`);
        await queryRunner.query(`INSERT INTO "image"("id", "url", "created_at", "updated_at", "note_id") SELECT "id", "url", "created_at", "updated_at", "note_id" FROM "temporary_image"`);
        await queryRunner.query(`DROP TABLE "temporary_image"`);
        await queryRunner.query(`ALTER TABLE "image" RENAME TO "temporary_image"`);
        await queryRunner.query(`CREATE TABLE "image" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "url" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "note_id" integer, CONSTRAINT "FK_2960a5f766c3b7e447856efb71e" FOREIGN KEY ("note_id") REFERENCES "note" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "image"("id", "url", "created_at", "updated_at", "note_id") SELECT "id", "url", "created_at", "updated_at", "note_id" FROM "temporary_image"`);
        await queryRunner.query(`DROP TABLE "temporary_image"`);
    }

}
