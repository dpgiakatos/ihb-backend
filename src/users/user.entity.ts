import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Role } from '../auth/models/role.entity';
import { IsUnique } from 'src/helpers/unique.decorator';
import { Exclude } from 'class-transformer';
import {ExtraVaccination} from "../vaccinations/extra_vaccination.entity";
import { Vaccination } from '../vaccinations/vaccination.entity';

@Entity()
@Unique(['email'])
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @IsUnique<User>(o => o.id)
    @Column()
    email: string;

    @Exclude()
    @Column()
    password: string;

    @OneToMany(() => Role, role => role.user, { eager: true })
    roles: Role[];

    @OneToMany(type => ExtraVaccination, extraVaccination => extraVaccination.user)
    extraVaccination: ExtraVaccination[];

    @ManyToMany(type => Vaccination)
    @JoinTable()
    vaccination: Vaccination[];
}
