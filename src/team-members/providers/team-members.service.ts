import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { TeamMember } from '../team-member.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTeamMemberDto } from '../dtos/create-team-member.dto';
import { GetTeamMembersDto } from '../dtos/get-team-members.dto';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interface';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { PatchTeamMemberDto } from '../dtos/patch-team-member.dto';

@Injectable()
export class TeamMembersService {
  constructor(
    /**Inject teamMemberRepository */
    @InjectRepository(TeamMember)
    private readonly teamMemberRepository: Repository<TeamMember>,
    /**Inject paginationProvider */
    private readonly paginationProvider: PaginationProvider,
  ) {}
  public async getAll(
    teamMemberQuery: GetTeamMembersDto,
  ): Promise<Paginated<TeamMember>> {
    let teamMembers = await this.paginationProvider.paginateQuery(
      {
        limit: teamMemberQuery.limit,
        page: teamMemberQuery.page,
      },
      this.teamMemberRepository,
      {
        order: {
          name: 'ASC',
        },
      },
    );
    return teamMembers;
  }

  public async getNames() {
    const result = await this.teamMemberRepository.find({
      select: {
        name: true,
      },
      order: {
        name: 'ASC',
      },
    });
    return result.map((nameValue) => nameValue.name);
  }

  public async create(createTeamMemberDto: CreateTeamMemberDto) {
    let newTeamMember = this.teamMemberRepository.create({
      ...createTeamMemberDto,
    });
    newTeamMember = await this.teamMemberRepository.save(newTeamMember);
    return newTeamMember;
  }

  public async delete(id: number) {
    await this.teamMemberRepository.delete(id);
  }

  public async update(patchTeamMemberDto: PatchTeamMemberDto, id: number) {
    const teamMember = await this.teamMemberRepository.findOneBy({
      id: id,
    });
    if (teamMember) {
      teamMember.name = patchTeamMemberDto.name ?? teamMember.name;
      teamMember.contactNumber =
        patchTeamMemberDto.contactNumber ?? teamMember.contactNumber;
      teamMember.contactEmail =
        patchTeamMemberDto.contactEmail ?? teamMember.contactEmail;
    }

    if (teamMember) {
      await this.teamMemberRepository.save(teamMember);
    }
    return teamMember;
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
}

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
