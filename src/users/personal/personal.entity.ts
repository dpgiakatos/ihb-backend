import { Entity, Unique, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../user.entity';
import { IsUnique } from '../../helpers/unique.decorator';
import { Exclude } from 'class-transformer';

@Entity()
@Unique(['ssnvs'])
export class Personal {
    @Exclude()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    firstName: string;
    
    @Column()
    lastName: string;

    @IsUnique<Personal>(o => o.id)
    @Column({ nullable: true })
    ssnvs: string;

    @Column({ nullable: true, type: 'date' })
    birthDate: string;

    @Column({ nullable: true })
    country: string;

    @Column({ nullable: true })
    fatherFirstName: string;

    @Column({ nullable: true })
    fatherLastName: string;

    @Column({ nullable: true })
    motherFirstName: string;

    @Column({ nullable: true })
    motherLastName: string;

    @Column({ nullable: true })
    mobilePhone: string;

    @Column({ nullable: true })
    emergencyContact: string;

    @Column()
    userId: string;

    @Exclude()
    @IsUnique<Personal>(o => o.id, { message: 'Personal information already exists. Please use Put method to edit' })
    @OneToOne(() => User)
    @JoinColumn()
    user?: User;
}