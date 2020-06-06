import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Role } from '../auth/models/role.entity';
import { IsUnique } from '../helpers/unique.decorator';
import { Exclude } from 'class-transformer';
import { ExtraVaccination } from './extra-vaccinations/extra-vaccination.entity';
import { Vaccine } from './vaccinations/vaccine.entity';
import { Allergic } from  './allergic/allergic.entity';
import { Hospital } from './hospital/hospital.entity';
import { Alert } from '../doctor/alert.entity';

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

    @OneToMany(() => ExtraVaccination, extraVaccination => extraVaccination.user)
    extraVaccinations?: ExtraVaccination[];

    @ManyToMany(() => Vaccine, { onDelete: 'CASCADE' })
    @JoinTable()
    vaccinations?: Vaccine[];
    
    @OneToMany(() => Allergic, allergic => allergic.user)
    allergic?: Allergic[];

    @OneToMany(() => Hospital, hospital => hospital.user)
    hospital?: Hospital[];

    @OneToMany(() => Alert, alert => alert.patient)
    patient?: Alert[];

    @OneToMany(() => Alert, alert => alert.doctor)
    doctor?: Alert[];
}
