import { Exclude } from 'class-transformer';
import { Customer } from 'src/customers/customer.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TeamMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 55,
  })
  name: string;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  contactNumber: string;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  contactEmail: string;

  @ManyToMany(() => Customer, (customer) => customer.teamMembers, {
    onDelete: 'CASCADE',
  })
  @Exclude()
  customers?: Customer[];
}
