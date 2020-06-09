import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Vaccine {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}