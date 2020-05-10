import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../users/user.entity";

@Entity()
export class ExtraVaccination {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    date: Date;

    @Column()
    description: string;

    @ManyToOne(type => User, user => user.extraVaccination)
    user: User;
}