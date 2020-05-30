import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { User } from '../user.entity';
import { Exclude } from 'class-transformer'

@Entity()
export class Hospital {
    @Exclude()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    city: string;

    @Column()
    country: string;

    @Column({ nullable: true })
    cause: string;

    @Column({ nullable: true })
    treatment: string;

    @Column({ nullable: true, type: 'date' })
    starts: string;

    @Column({ nullable: true, type: 'date' })
    finishes: string;

    @Column()
    userId: string;

    @Exclude()
    @ManyToOne(() => User)
    @JoinColumn()
    user: User;

}