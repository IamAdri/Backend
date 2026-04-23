import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTeamMemberDto } from '../dtos/create-team-member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TeamMember } from '../team-member.entity';
import { In, Repository } from 'typeorm';
import { Customer } from 'src/customers/customer.entity';
import { HashingProvider } from 'src/auth/providers/hashing.provider';

@Injectable()
export class CreateTeamMemberProvider {
  constructor(
    /**Inject teamMemberRepository */
    @InjectRepository(TeamMember)
    private readonly teamMemberRepository: Repository<TeamMember>,
    /**Inject customerRepository */
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    /**Inject hashingProvider */
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,
  ) {}
  public async create(createTeamMemberDto: CreateTeamMemberDto) {
    //Check if team member already exists
    const existingTeamMember = await this.teamMemberRepository.findOne({
      where: {
        name: createTeamMemberDto.name,
      },
    });
    if (existingTeamMember) {
      throw new ConflictException('This team member name already exists!');
    }
    //Check if customers associated exists
    let customers: Customer[] = [];
    if (createTeamMemberDto.customers?.length) {
      customers = await this.customerRepository.findBy({
        companyName: In(createTeamMemberDto.customers),
      });
      if (customers.length !== createTeamMemberDto.customers.length) {
        throw new NotFoundException(
          'Could not find all customers associated. Please check their names and try again.',
        );
      }
    }
    //Create new team member in DB
    try {
      const newTeamMember = this.teamMemberRepository.create({
        ...createTeamMemberDto,
        customers: customers,
        password: await this.hashingProvider.hashPassword(
          createTeamMemberDto.password,
        ),
      });
      return await this.teamMemberRepository.save(newTeamMember);
    } catch (err) {
      console.error('Database error:', err);
      throw new InternalServerErrorException(
        'Could not create new team member. Please try again!',
      );
    }
  }
}
