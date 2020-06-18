import {MigrationInterface, QueryRunner} from "typeorm";

export class Initial1592517898812 implements MigrationInterface {
    name = 'Initial1592517898812'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `role` (`id` int NOT NULL AUTO_INCREMENT, `role` enum ('User', 'Doctor', 'Administrator') NOT NULL, `userId` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `extra_vaccination` (`id` varchar(36) NOT NULL, `name` varchar(255) NOT NULL, `date` date NOT NULL, `description` varchar(255) NOT NULL, `userId` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `vaccine` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `allergic` (`id` varchar(36) NOT NULL, `name` varchar(255) NOT NULL, `diseaseDescription` varchar(255) NOT NULL, `treatmentDescription` varchar(255) NOT NULL, `userId` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `hospital_treatment` (`id` varchar(36) NOT NULL, `name` varchar(255) NOT NULL, `city` varchar(255) NOT NULL, `country` varchar(255) NOT NULL, `cause` varchar(255) NULL, `treatment` varchar(255) NULL, `starts` date NULL, `finishes` date NULL, `userId` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `alert` (`id` varchar(36) NOT NULL, `accessTime` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `patientId` varchar(36) NULL, `doctorId` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `token` (`id` int NOT NULL AUTO_INCREMENT, `tokenType` enum ('forgotPassword', 'verify') NOT NULL, `token` char(96) NOT NULL, `timestamp` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `userId` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `user` (`id` varchar(36) NOT NULL, `email` varchar(255) NOT NULL, `password` varchar(255) NOT NULL, `verified` tinyint NOT NULL DEFAULT 0, UNIQUE INDEX `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`), PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `application` (`id` varchar(36) NOT NULL, `suffix` varchar(255) NOT NULL, `createdTime` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `userId` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `contact` (`id` int NOT NULL AUTO_INCREMENT, `email` varchar(255) NOT NULL, `subject` varchar(255) NOT NULL, `message` text NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `personal` (`id` varchar(36) NOT NULL, `firstName` varchar(255) NOT NULL, `lastName` varchar(255) NOT NULL, `ssnvs` varchar(255) NULL, `birthDate` date NULL, `country` varchar(255) NULL, `fatherFirstName` varchar(255) NULL, `fatherLastName` varchar(255) NULL, `motherFirstName` varchar(255) NULL, `motherLastName` varchar(255) NULL, `mobilePhone` varchar(255) NULL, `emergencyContact` varchar(255) NULL, `userId` varchar(255) NOT NULL, UNIQUE INDEX `IDX_0b164c57b9df5c0c7aa0050e26` (`ssnvs`), UNIQUE INDEX `REL_a26de179fa85b121b5562d1866` (`userId`), PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `user_vaccinations_vaccine` (`userId` varchar(36) NOT NULL, `vaccineId` int NOT NULL, INDEX `IDX_2558ad735f04f411d70c58888e` (`userId`), INDEX `IDX_0313baf94a83c98b21de9ceac3` (`vaccineId`), PRIMARY KEY (`userId`, `vaccineId`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("ALTER TABLE `role` ADD CONSTRAINT `FK_3e02d32dd4707c91433de0390ea` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `extra_vaccination` ADD CONSTRAINT `FK_121a6e208324049a1bb87841b2b` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `allergic` ADD CONSTRAINT `FK_d37f33e42d48b49ca8673fa99bb` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `hospital_treatment` ADD CONSTRAINT `FK_7bde921eda1abfceecef1e81c58` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `alert` ADD CONSTRAINT `FK_4d1998afcd1e3e7699e980304fe` FOREIGN KEY (`patientId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `alert` ADD CONSTRAINT `FK_5e405147dd71e440c7e954e905c` FOREIGN KEY (`doctorId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `token` ADD CONSTRAINT `FK_94f168faad896c0786646fa3d4a` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `application` ADD CONSTRAINT `FK_b4ae3fea4a24b4be1a86dacf8a2` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `personal` ADD CONSTRAINT `FK_a26de179fa85b121b5562d18664` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `user_vaccinations_vaccine` ADD CONSTRAINT `FK_2558ad735f04f411d70c58888e0` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `user_vaccinations_vaccine` ADD CONSTRAINT `FK_0313baf94a83c98b21de9ceac30` FOREIGN KEY (`vaccineId`) REFERENCES `vaccine`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user_vaccinations_vaccine` DROP FOREIGN KEY `FK_0313baf94a83c98b21de9ceac30`", undefined);
        await queryRunner.query("ALTER TABLE `user_vaccinations_vaccine` DROP FOREIGN KEY `FK_2558ad735f04f411d70c58888e0`", undefined);
        await queryRunner.query("ALTER TABLE `personal` DROP FOREIGN KEY `FK_a26de179fa85b121b5562d18664`", undefined);
        await queryRunner.query("ALTER TABLE `application` DROP FOREIGN KEY `FK_b4ae3fea4a24b4be1a86dacf8a2`", undefined);
        await queryRunner.query("ALTER TABLE `token` DROP FOREIGN KEY `FK_94f168faad896c0786646fa3d4a`", undefined);
        await queryRunner.query("ALTER TABLE `alert` DROP FOREIGN KEY `FK_5e405147dd71e440c7e954e905c`", undefined);
        await queryRunner.query("ALTER TABLE `alert` DROP FOREIGN KEY `FK_4d1998afcd1e3e7699e980304fe`", undefined);
        await queryRunner.query("ALTER TABLE `hospital_treatment` DROP FOREIGN KEY `FK_7bde921eda1abfceecef1e81c58`", undefined);
        await queryRunner.query("ALTER TABLE `allergic` DROP FOREIGN KEY `FK_d37f33e42d48b49ca8673fa99bb`", undefined);
        await queryRunner.query("ALTER TABLE `extra_vaccination` DROP FOREIGN KEY `FK_121a6e208324049a1bb87841b2b`", undefined);
        await queryRunner.query("ALTER TABLE `role` DROP FOREIGN KEY `FK_3e02d32dd4707c91433de0390ea`", undefined);
        await queryRunner.query("DROP INDEX `IDX_0313baf94a83c98b21de9ceac3` ON `user_vaccinations_vaccine`", undefined);
        await queryRunner.query("DROP INDEX `IDX_2558ad735f04f411d70c58888e` ON `user_vaccinations_vaccine`", undefined);
        await queryRunner.query("DROP TABLE `user_vaccinations_vaccine`", undefined);
        await queryRunner.query("DROP INDEX `REL_a26de179fa85b121b5562d1866` ON `personal`", undefined);
        await queryRunner.query("DROP INDEX `IDX_0b164c57b9df5c0c7aa0050e26` ON `personal`", undefined);
        await queryRunner.query("DROP TABLE `personal`", undefined);
        await queryRunner.query("DROP TABLE `contact`", undefined);
        await queryRunner.query("DROP TABLE `application`", undefined);
        await queryRunner.query("DROP INDEX `IDX_e12875dfb3b1d92d7d7c5377e2` ON `user`", undefined);
        await queryRunner.query("DROP TABLE `user`", undefined);
        await queryRunner.query("DROP TABLE `token`", undefined);
        await queryRunner.query("DROP TABLE `alert`", undefined);
        await queryRunner.query("DROP TABLE `hospital_treatment`", undefined);
        await queryRunner.query("DROP TABLE `allergic`", undefined);
        await queryRunner.query("DROP TABLE `vaccine`", undefined);
        await queryRunner.query("DROP TABLE `extra_vaccination`", undefined);
        await queryRunner.query("DROP TABLE `role`", undefined);
    }

}
