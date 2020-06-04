import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { User } from '../user.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Allergic {
    @Exclude()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    diseaseDescription: string;

    @Column()
    treatmentDescription: string;

    @Column()
    userId: string;

    @Exclude()
    @ManyToOne(() => User)
    @JoinColumn()
    user?: User;
}