/* import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyNewsTable implements MigrationInterface {
    //   en caso que en produccion se aumenten campos se correran estas migrations desactivando el synchronize de la app ya que es peligoos usarlo en produccion

    async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
                ''//'ALTER TABLE "user" ADD image varchar(255)'
        );
    }
    async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
                ''//'ALTER TABLE "user" DROP COLUMN image'
        );
    }
} */