import { Entity, Unique, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import {User} from "../users/user.entity";

@Entity()
@Unique(["email"])
@Unique(["ssnvs"])
@Unique(["mobilePhone"])
export class Personal {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    firstName: string;
    
    @Column()
    lastName: string;

    @Column()
    ssnvs: number;

    @Column()
    birthDate: Date;

    @Column()
    country: string;

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
    user: string
}