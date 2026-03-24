import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { customerProjectType } from './enums/customerProjectType.enum';
import { customerStatus } from './enums/customerStatus.enum';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 55,
    nullable: false,
  })
  companyName: string;

  @Column({
    type: 'varchar',
    length: 55,
    nullable: false,
  })
  contactName: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  contactEmail: string;

  @Column({
    type: 'varchar',
    length: 55,
    nullable: false,
  })
  industry: string;

  @Column({
    type: 'enum',
    enum: customerProjectType,
    nullable: false,
    default: customerProjectType.CRM,
  })
  projectType: customerProjectType;

  @Column({
    type: 'enum',
    enum: customerStatus,
    nullable: false,
    default: customerStatus.SCHEDULED,
  })
  status: customerStatus;

  @Column({
    type: 'timestamp',
    nullable: false,
  })
  deadline: Date;

  @CreateDateColumn()
  createdAt: Date;
}
