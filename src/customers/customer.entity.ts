import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { customerProjectType } from './enums/customerProjectType.enum';
import { customerStatus } from './enums/customerStatus.enum';
import { TeamMember } from 'src/team-members/team-member.entity';

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

  @ManyToMany(() => TeamMember, (teamMember) => teamMember.customers, {
    eager: true,
  })
  @JoinTable()
  teamMembers?: TeamMember[];

  @Column({
    type: 'timestamp',
    nullable: false,
  })
  deadline: Date;

  @CreateDateColumn()
  createdAt: Date;
}
