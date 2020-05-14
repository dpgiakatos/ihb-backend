import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Allergic {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    dDescription: string;

    @Column()
    tDescription: string;

    @ManyToOne(() => User, user => user.allergic)
    user: string;
}