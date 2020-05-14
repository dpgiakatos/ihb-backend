import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { User } from 'src/users/user.entity';

@Entity()
export class Hospital {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    city: string;

    @Column()
    country: string;

    @Column()
    cause: string;

    @Column()
    description: string;

    @Column()
    start: Date;

    @Column()
    end: Date;

    @ManyToOne(() => User, user => user.hospital)
    user: User;

}