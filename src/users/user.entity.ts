import { Column, Entity, PrimaryGeneratedColumn, Unique, OneToMany } from 'typeorm';
import { Role } from '../auth/models/role.entity';
import {ExtraVaccination} from "../vaccinations/extra_vaccination.entity";
import { Vaccination } from '../vaccinations/vaccination.entity';
import { Allergic } from  '../allergic/allergic.entity';
import { IsUnique } from 'src/helpers/unique.decorator';
import { Hospital } from 'src/hospital/hospital.entity';

@Entity()
@Unique(['email'])
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @IsUnique()
    @Column()
    email: string;

    @Column()
    password: string;

    @OneToMany(() => Role, role => role.user, { eager: true })
    roles: Role[];

    @OneToMany(() => Hospital, hospital => hospital.user)
    hospital: Hospital[];
}
