import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Alert {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    accessTime: Date;

    @ManyToOne(() => User, user => user.patient, { onDelete: 'CASCADE' })
    @JoinColumn()
    patient: User;

    @ManyToOne(() => User, user => user.doctor, { onDelete: 'CASCADE' })
    @JoinColumn()
    doctor: User;
}
