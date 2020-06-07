import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Application {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    suffix: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    createdTime: Date;

    @ManyToOne(() => User, user => user.applications, { onDelete: 'CASCADE' })
    user: User;
}
