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
    ssnvs: string;

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
    mobilePhone: string;

    @Column()
    emergencyContact: string;

    @OneToOne(type => User)
    @JoinColumn()
    user: string
}