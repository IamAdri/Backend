import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { TeamMember } from '../team-member.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTeamMemberDto } from '../dtos/create-team-member.dto';
import { GetTeamMembersDto } from '../dtos/get-team-members.dto';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interface';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { PatchTeamMemberDto } from '../dtos/patch-team-member.dto';
import { CustomersService } from 'src/customers/providers/customers.service';
import { Customer } from 'src/customers/customer.entity';
import { AuthService } from 'src/auth/providers/auth.service';
import { CreateTeamMemberProvider } from './create-team-member.provider';
import { FindOneTeamMemberByEmailProvider } from './find-one-team-member-by-email.provider';

@Injectable()
export class TeamMembersService {
  constructor(
    /**Inject teamMemberRepository */
    @InjectRepository(TeamMember)
    private readonly teamMemberRepository: Repository<TeamMember>,
    /**Inject customerRepository */
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    /**Inject paginationProvider */
    private readonly paginationProvider: PaginationProvider,
    /**Inject authService */
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    /**Inject createTeamMemberProvider */
    private readonly createTeamMemberProvider: CreateTeamMemberProvider,
    /**Inject findOneTeamMemberByEmailProvider */
    private readonly findOneTeamMemberByEmailProvider: FindOneTeamMemberByEmailProvider,
  ) {}
  public async getAll(
    teamMemberQuery: GetTeamMembersDto,
  ): Promise<Paginated<TeamMember>> {
    let teamMembers: Paginated<TeamMember>;
    try {
      teamMembers = await this.paginationProvider.paginateQuery(
        {
          limit: teamMemberQuery.limit,
          page: teamMemberQuery.page,
        },
        this.teamMemberRepository,
        {
          order: {
            name: 'ASC',
          },
          relations: ['customers'],
          select: {
            customers: {
              id: true,
              companyName: true,
            },
          },
        },
      );
    } catch (err) {
      throw new RequestTimeoutException(
        'The server is taking too long to respond. Please try again later!',
        { description: 'Error during pagination or database connection.' },
      );
    }

    teamMembers.data?.forEach((teamMember) => {
      if (teamMember.customers?.length) {
        teamMember.customers.sort((a, b) =>
          (a.companyName || '').localeCompare(b.companyName || ''),
        );
      }
    });
    return teamMembers;
  }

  public async getNames() {
    try {
      const result = await this.teamMemberRepository.find({
        select: {
          name: true,
        },
        order: {
          name: 'ASC',
        },
      });
      return result?.map((nameValue) => nameValue.name) || [];
    } catch (err) {
      console.error('Fetch company names error:', err);
      throw new InternalServerErrorException('Could not get team names.');
    }
  }

  public async create(createTeamMemberDto: CreateTeamMemberDto) {
    return await this.createTeamMemberProvider.create(createTeamMemberDto);
  }

  public async delete(id: number) {
    //Check if there is a team member with requested id
    const teamMember = await this.teamMemberRepository.findOne({
      where: { id },
      relations: ['customers'],
    });
    if (!teamMember) {
      throw new NotFoundException(
        `There is not a team member with this ID: ${id}`,
      );
    }
    //Delete team member
    try {
      await this.teamMemberRepository.remove(teamMember);
      return { deleted: true, id };
    } catch (err) {
      throw new InternalServerErrorException(
        'Could not delete team member. Please try again!',
      );
    }
  }

  public async update(patchTeamMemberDto: PatchTeamMemberDto, id: number) {
    //Check if there is a team member with requested id
    const teamMember = await this.teamMemberRepository.findOne({
      where: { id },
      relations: ['customers'],
    });
    if (!teamMember) {
      throw new NotFoundException(
        `There is not a team member with this ID: ${id}`,
      );
    }
    //Check if there is another team member with updated name
    if (patchTeamMemberDto.name) {
      const existingTeamMember = await this.teamMemberRepository.findOne({
        where: {
          name: patchTeamMemberDto.name,
        },
      });
      if (existingTeamMember && existingTeamMember.id !== id) {
        throw new ConflictException(
          'There is already another team member with this name.',
        );
      }
    }

    //Check customers associated to updated team member
    if (patchTeamMemberDto.customers) {
      const customers = await this.customerRepository.findBy({
        companyName: In(patchTeamMemberDto.customers),
      });
      if (customers.length !== patchTeamMemberDto.customers.length) {
        throw new NotFoundException(
          'Could not found all customers associated.',
        );
      }
      teamMember.customers = customers;
    }
    //Update team member
    const { customers, ...restOfDto } = patchTeamMemberDto;
    Object.assign(teamMember, restOfDto);
    try {
      return await this.teamMemberRepository.save(teamMember);
    } catch (err) {
      throw new InternalServerErrorException('Could not update team member!');
    }
  }

  public async findMultipleTeamMembers(teamMembers: string[]) {
    let results = await this.teamMemberRepository.find({
      where: {
        name: In(teamMembers),
      },
      order: {
        name: 'ASC',
      },
    });
    return results;
  }

  public async findOneByEmail(email: string) {
    return await this.findOneTeamMemberByEmailProvider.findOneByEmail(email);
  }

  public async findOneById(id: number) {
    let teamMember: TeamMember | null;
    try {
      teamMember = await this.teamMemberRepository.findOneBy({ id });
    } catch (err) {
      throw new InternalServerErrorException('Faild to connect to database!');
    }
    if (!teamMember) {
      throw new UnauthorizedException('Team member does not exist!');
    }
    return teamMember;
  }
}
/**
 * let teamMembers;
    if (createCustomerDto.teamMembers) {
      teamMembers = await this.teamMembersService.findMultipleTeamMembers(
        createCustomerDto.teamMembers,
      );
    }
 */

/*public async getAll(
    customerQuery: PaginationQueryDto,
  ): Promise<Paginated<Customer>> {
    let customers = await this.paginationProvider.paginateQuery(
      {
        limit: customerQuery.limit,
        page: customerQuery.page,
      },
      this.customersRepository,
      {
        order: {
          createdAt: 'ASC',
        },
      },
    );
    return customers;
  }*/

/*//Check customers associated with team member
    let customers;
    if (patchTeamMemberDto.customers) {
     customers = teamMember.customers = await this.customerRepository.findBy({
        companyName: In(patchTeamMemberDto.customers),
      });

      if (teamMember) {
      teamMember.name = patchTeamMemberDto.name ?? teamMember.name;
      teamMember.contactNumber =
        patchTeamMemberDto.contactNumber ?? teamMember.contactNumber;
      teamMember.contactEmail =
        patchTeamMemberDto.contactEmail ?? teamMember.contactEmail;
    }

      
    }*/
