import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Application {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    suffix: string;

    @ManyToOne(() => User, user => user.applications, { onDelete: 'CASCADE' })
    user: User;
}
