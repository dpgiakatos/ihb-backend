import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { User } from '../user.entity';
import { Exclude } from 'class-transformer';

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

    @Column()
    userId: string;

    @Exclude()
    @ManyToOne(() => User, user => user.extraVaccinations, { onDelete: 'CASCADE' })
    @JoinColumn()
    user?: User;
}
