import { Column, Entity, PrimaryGeneratedColumn, Unique, OneToMany } from 'typeorm';
import { Role } from '../auth/models/role.entity';
import { IsUnique } from 'src/helpers/unique.decorator';
import { Hospital } from 'src/hospital/hospital.entity';
import { HospitalModule } from 'src/hospital/hospital.module';

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

    // @OneToMany(() => Hospital, hospital => hospital.user)
    hospital: Hospital[];
}
