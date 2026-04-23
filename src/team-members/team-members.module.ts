import { forwardRef, Module } from '@nestjs/common';
import { TeamMembersController } from './team-members.controller';
import { TeamMembersService } from './providers/team-members.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamMember } from './team-member.entity';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { CustomersModule } from 'src/customers/customers.module';
import { Customer } from 'src/customers/customer.entity';
import { AuthModule } from 'src/auth/auth.module';
import { CreateTeamMemberProvider } from './providers/create-team-member.provider';
import { FindOneTeamMemberByEmailProvider } from './providers/find-one-team-member-by-email.provider';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from 'src/auth/config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from 'src/auth/guards/access-token/access-token.guard';

@Module({
  controllers: [TeamMembersController],
  providers: [
    TeamMembersService,
    CreateTeamMemberProvider,
    FindOneTeamMemberByEmailProvider,
  ],
  imports: [
    TypeOrmModule.forFeature([TeamMember, Customer]),
    PaginationModule,
    forwardRef(() => AuthModule),
  ],
  exports: [TeamMembersService],
})
export class TeamMembersModule {}
