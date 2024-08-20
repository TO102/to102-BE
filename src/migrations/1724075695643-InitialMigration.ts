import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTagTables1629446500000 implements MigrationInterface {
  name = 'UpdateTagTables1629446500000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop existing tables if they exist
    await queryRunner.query(`DROP TABLE IF EXISTS "post_tag"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "tag"`);

    // Create tag table
    await queryRunner.query(`
            CREATE TABLE "tag" (
                "tag_id" SERIAL PRIMARY KEY,
                "name" VARCHAR NOT NULL
            )
        `);

    // Create post_tag table
    await queryRunner.query(`
            CREATE TABLE "post_tag" (
                "post_tag_id" SERIAL PRIMARY KEY,
                "post_id" INTEGER NOT NULL,
                "tag_id" INTEGER NOT NULL,
                FOREIGN KEY ("post_id") REFERENCES "post"("post_id"),
                FOREIGN KEY ("tag_id") REFERENCES "tag"("tag_id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "post_tag"`);
    await queryRunner.query(`DROP TABLE "tag"`);
  }
}
