import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user.entity';

@Entity()
export class ExtraVaccination {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ type: 'date' })
    date: string;

    @Column()
    description: string;

    @ManyToOne(() => User, user => user.extraVaccinations)
    user: User;
}