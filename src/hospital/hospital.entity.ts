import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm'
import { User } from 'src/users/user.entity';
import { Exclude } from 'class-transformer'

@Entity()
export class Hospital {
    @Exclude()
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    city: string;

    @Column()
    country: string;

    @Column({ nullable: true })
    cause: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true, type: 'date' })
    start: Date;

    @Column({nullable: true, type: 'date' })
    end: Date;

    @ManyToOne(() => User, user => user.hospital)
    user: User;

}