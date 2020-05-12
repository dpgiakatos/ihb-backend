import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Vaccination {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}