import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Role as RoleEnum } from 'src/auth/models/claims.interface';
import { User } from '../../users/user.entity';

@Entity()
export class Role {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('enum', { enum: RoleEnum })
    role: RoleEnum;

    @ManyToOne(() => User, user => user.roles)
    user: User;
}