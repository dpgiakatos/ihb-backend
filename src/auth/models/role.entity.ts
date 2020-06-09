import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Role as RoleEnum } from '../models/claims.interface';
import { User } from '../../app/users/user.entity';

@Entity()
export class Role {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('enum', { enum: RoleEnum })
    role: RoleEnum;

    @ManyToOne(() => User, user => user.roles, { onDelete: 'CASCADE' })
    user: User;
}
