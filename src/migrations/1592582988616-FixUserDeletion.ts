import {MigrationInterface, QueryRunner} from "typeorm";

export class FixUserDeletion1592582988616 implements MigrationInterface {
    name = 'FixUserDeletion1592582988616'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `token` DROP FOREIGN KEY `FK_94f168faad896c0786646fa3d4a`");
        await queryRunner.query("ALTER TABLE `token` ADD CONSTRAINT `FK_94f168faad896c0786646fa3d4a` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `token` DROP FOREIGN KEY `FK_94f168faad896c0786646fa3d4a`");
        await queryRunner.query("ALTER TABLE `token` ADD CONSTRAINT `FK_94f168faad896c0786646fa3d4a` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

}
