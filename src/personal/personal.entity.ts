import { Entity, Unique, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import {User} from "../users/user.entity";
import { type } from "os";

@Entity()
@Unique(["email"])
@Unique(["ssnvs"])
@Unique(["mobilePhone"])
export class Personal {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;
    
    @Column()
    lastName: string;

    @Column()
    ssnvs: number;

    @Column("date")
    birthDate: string;

    @Column()
    county: string;

    @Column()
    fatherFirstName: string;

    @Column()
    fatherLastName: string;

    @Column()
    motherFirstName: string;

    @Column()
    motherLastName: string;

    @Column()
    email: string;

    @Column()
    mobilePhone: number;

    @Column()
    emergencyContact: number;

    @OneToOne(type => User)
    @JoinColumn()
    user: User
}