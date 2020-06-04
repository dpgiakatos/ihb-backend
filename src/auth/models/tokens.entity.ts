import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/user.entity';
import { Token as TokenEnum } from '../models/token.interface'
import { Exclude } from 'class-transformer';


@Entity()
export class Token {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('enum', { enum: TokenEnum })
    tokenType: TokenEnum;

    @Column()
    token: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6) '})
    timestamp: Date;

    @Column({ type: 'boolean' })
    isActive: boolean;

    @Column()
    userId: string;

    @Exclude()
    @ManyToOne(() => User)
    @JoinColumn()
    user: User;
}