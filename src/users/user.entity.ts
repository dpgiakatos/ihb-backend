import { Column, Entity, PrimaryGeneratedColumn, Unique, OneToMany } from 'typeorm';
import { Role } from '../auth/models/role.entity';
import { IsUnique } from '../helpers/unique.decorator';
import { Exclude } from 'class-transformer';

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
}
