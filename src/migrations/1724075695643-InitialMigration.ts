import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserEntityToCamelCase1234567890123
  implements MigrationInterface
{
  name = 'UpdateUserEntityToCamelCase1234567890123';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Helper function to check if column exists and add if it doesn't
    const addColumnIfNotExists = async (
      table: string,
      column: string,
      dataType: string,
    ) => {
      await queryRunner.query(`
                DO $$ 
                BEGIN 
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '${table}' AND column_name = '${column}') THEN
                        ALTER TABLE "${table}" ADD COLUMN "${column}" ${dataType};
                    END IF;
                END $$;
            `);
    };

    // Add missing columns if they don't exist
    await addColumnIfNotExists('user', 'updated_at', 'TIMESTAMP DEFAULT now()');
    await addColumnIfNotExists('user', 'current_refresh_token', 'VARCHAR');

    // Rename existing columns
    const columnsToRename = [
      ['oauth_provider', 'oauthProvider'],
      ['oauth_id', 'oauthId'],
      ['profile_picture_url', 'profilePictureUrl'],
      ['created_at', 'createdAt'],
      ['updated_at', 'updatedAt'],
      ['last_login', 'lastLogin'],
      ['is_active', 'isActive'],
      ['deactivated_at', 'deactivatedAt'],
      ['average_rating', 'averageRating'],
      ['current_refresh_token', 'currentRefreshToken'],
    ];

    for (const [oldName, newName] of columnsToRename) {
      await queryRunner.query(`
                DO $$
                BEGIN
                    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user' AND column_name = '${oldName}') THEN
                        ALTER TABLE "user" RENAME COLUMN "${oldName}" TO "${newName}";
                    END IF;
                END $$;
            `);
    }

    // Update indexes if necessary
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_USER_OAUTH_ID"`);
    await queryRunner.query(
      `CREATE INDEX "IDX_USER_OAUTH_ID" ON "user" ("oauthId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert column names
    const columnsToRevert = [
      ['oauthProvider', 'oauth_provider'],
      ['oauthId', 'oauth_id'],
      ['profilePictureUrl', 'profile_picture_url'],
      ['createdAt', 'created_at'],
      ['updatedAt', 'updated_at'],
      ['lastLogin', 'last_login'],
      ['isActive', 'is_active'],
      ['deactivatedAt', 'deactivated_at'],
      ['averageRating', 'average_rating'],
      ['currentRefreshToken', 'current_refresh_token'],
    ];

    for (const [newName, oldName] of columnsToRevert) {
      await queryRunner.query(`
                DO $$
                BEGIN
                    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user' AND column_name = '${newName}') THEN
                        ALTER TABLE "user" RENAME COLUMN "${newName}" TO "${oldName}";
                    END IF;
                END $$;
            `);
    }

    // Revert index if necessary
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_USER_OAUTH_ID"`);
    await queryRunner.query(
      `CREATE INDEX "IDX_USER_OAUTH_ID" ON "user" ("oauth_id")`,
    );
  }
}
