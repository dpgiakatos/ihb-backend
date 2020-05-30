import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Alert {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    startAccessTime: Date;

    @ManyToOne(() => User, user => user.patient)
    @JoinColumn()
    patient: User;

    @ManyToOne(() => User, user => user.doctor)
    @JoinColumn()
    doctor: User;
}
