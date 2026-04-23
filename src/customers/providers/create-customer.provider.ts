import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Customer } from '../customer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { TeamMember } from 'src/team-members/team-member.entity';
import { ActiveTeamMemberData } from 'src/auth/interfaces/active-team-member-data.interface';

@Injectable()
export class CreateCustomerProvider {
  constructor(
    /**Inject customer repository */
    @InjectRepository(Customer)
    private readonly customersRepository: Repository<Customer>,
  ) {}

  public async createCustomer(
    createCustomerDto: CreateCustomerDto,
    teamMember: ActiveTeamMemberData,
  ) {
    //Check the team member signed in
    let teamMemberSignedIn;
    try {
      teamMemberSignedIn = [teamMember.sub, teamMember.email];
      console.log(teamMemberSignedIn);
    } catch (err) {
      throw new ConflictException(err);
    }

    //Check if company name exists already in DB
    const existingCustomer = await this.customersRepository.findOne({
      where: {
        companyName: createCustomerDto.companyName,
      },
    });

    if (existingCustomer) {
      throw new ConflictException(
        'A company with this name already exists. Please insert a different name.',
      );
    }

    //Save the new customer in DB
    try {
      const newCustomer = this.customersRepository.create({
        ...createCustomerDto,
      });

      return await this.customersRepository.save(newCustomer);
    } catch (err) {
      console.log('Database error:', err);
      //Check if there is an error regarding duplicate data
      if (err && typeof err === 'object' && 'code' in err) {
        if (err.code === '23505') {
          throw new ConflictException(
            'Duplicate values detected. Please check that your details are unique!',
          );
        }
      }

      throw new InternalServerErrorException(
        'The server encountered an error saving new this.customersRepository. Please try again!',
      );
    }
  }
}

/*//Find teamMembers
    let teamMembers: TeamMember[] = [];
    if (createCustomerDto.teamMembers?.length) {
      teamMembers = await this.teamMemberRepository.findBy({
        name: In(createCustomerDto.teamMembers),
      });
      if (teamMembers.length !== createCustomerDto.teamMembers.length) {
        throw new NotFoundException(
          'One or more team members were not found. Please check their name and try again!',
        );
      }
    }

    teamMembers: teamMembers,
*/
