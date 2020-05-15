import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Role } from '../auth/models/role.entity';
import {ExtraVaccination} from "../vaccinations/extra_vaccination.entity";
import { Vaccination } from '../vaccinations/vaccination.entity';
import { Allergic } from  '../allergic/allergic.entity';

@Entity()
@Unique(['email'])
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @OneToMany(() => Role, role => role.user, { eager: true })
    roles: Role[];

    @OneToMany(type => ExtraVaccination, extraVaccination => extraVaccination.user)
    extraVaccination: ExtraVaccination[];

    @ManyToMany(type => Vaccination)
    @JoinTable()
    vaccination: Vaccination[];

    @OneToMany(type => Allergic, allergic => allergic.user)
    allergic: Allergic[];
}
