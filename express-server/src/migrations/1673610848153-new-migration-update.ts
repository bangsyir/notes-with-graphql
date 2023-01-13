import { MigrationInterface, QueryRunner } from "typeorm";

export class newMigrationUpdate1673610848153 implements MigrationInterface {
    name = 'newMigrationUpdate1673610848153'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_note" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "views" integer NOT NULL)`);
        await queryRunner.query(`INSERT INTO "temporary_note"("id", "title", "description", "created_at", "updated_at", "deleted_at") SELECT "id", "title", "description", "created_at", "updated_at", "deleted_at" FROM "note"`);
        await queryRunner.query(`DROP TABLE "note"`);
        await queryRunner.query(`ALTER TABLE "temporary_note" RENAME TO "note"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "note" RENAME TO "temporary_note"`);
        await queryRunner.query(`CREATE TABLE "note" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime)`);
        await queryRunner.query(`INSERT INTO "note"("id", "title", "description", "created_at", "updated_at", "deleted_at") SELECT "id", "title", "description", "created_at", "updated_at", "deleted_at" FROM "temporary_note"`);
        await queryRunner.query(`DROP TABLE "temporary_note"`);
    }

}
