import { Customer } from 'src/customers/customer.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { userRole } from './enums/user-role.enum';

@Entity()
export class TeamMember {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 55,
  })
  name!: string;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  contactNumber!: string;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  contactEmail!: string;

  @Column({
    type: 'varchar',
    select: false,
    nullable: false,
    unique: true,
  })
  password!: string;

  @Column({
    type: 'enum',
    enum: userRole,
    nullable: false,
  })
  role!: userRole;

  @ManyToMany(() => Customer, (customer) => customer.teamMembers, {
    onDelete: 'CASCADE',
  })
  customers?: Customer[];
}
