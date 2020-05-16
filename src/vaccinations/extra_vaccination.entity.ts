import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class ExtraVaccination {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: 'date' })
    date: Date;

    @Column()
    description: string;

    @ManyToOne(() => User, user => user.extraVaccination)
    user: User;
}