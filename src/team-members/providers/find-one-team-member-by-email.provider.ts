import {
  Injectable,
  NotFoundException,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TeamMember } from '../team-member.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FindOneTeamMemberByEmailProvider {
  constructor(
    /**Inject teamMembersRepository */
    @InjectRepository(TeamMember)
    private readonly teamMemberRepository: Repository<TeamMember>,
  ) {}
  public async findOneByEmail(email: string) {
    let teamMember: TeamMember | null;

    try {
      teamMember = await this.teamMemberRepository.findOne({
        where: {
          contactEmail: email,
        },
        select: [
          'id',
          'name',
          'contactEmail',
          'contactNumber',
          'password',
          'customers',
        ],
      });
    } catch (err) {
      throw new RequestTimeoutException(err, {
        description: 'Could not find the team member!',
      });
    }

    if (!teamMember) {
      throw new UnauthorizedException('Team member does not exist!');
    }
    return teamMember;
  }
}
