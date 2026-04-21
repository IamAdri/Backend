import { forwardRef, Module } from '@nestjs/common';
import { TeamMembersController } from './team-members.controller';
import { TeamMembersService } from './providers/team-members.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamMember } from './team-member.entity';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { CustomersModule } from 'src/customers/customers.module';
import { Customer } from 'src/customers/customer.entity';

@Module({
  controllers: [TeamMembersController],
  providers: [TeamMembersService],
  imports: [TypeOrmModule.forFeature([TeamMember, Customer]), PaginationModule],
  exports: [TeamMembersService],
})
export class TeamMembersModule {}
