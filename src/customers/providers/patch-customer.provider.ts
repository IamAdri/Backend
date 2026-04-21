import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from '../customer.entity';
import { In, Repository } from 'typeorm';
import { PatchCustomerDto } from '../dtos/patch-customer.dto';
import { TeamMembersService } from 'src/team-members/providers/team-members.service';
import { TeamMember } from 'src/team-members/team-member.entity';

@Injectable()
export class PatchCustomersProvider {
  constructor(
    /**Inject repository Customer*/
    @InjectRepository(Customer)
    private readonly customersRepository: Repository<Customer>,
    /**Inject teamMemberRepository */
    @InjectRepository(TeamMember)
    private readonly teamMemberRepository: Repository<TeamMember>,
    /**Inject TeamMembersService */
    private readonly teamMembersService: TeamMembersService,
  ) {}
  public async update(patchCustomerDto: PatchCustomerDto, id: number) {
    //Find the teamMembers associated
    // let teamMembers;
    //  if (patchCustomerDto.teamMembers) {
    //   teamMembers = await this.teamMembersService.findMultipleTeamMembers(
    //      patchCustomerDto.teamMembers,
    //    );
    //   }
    const customer = await this.customersRepository.findOne({
      where: { id },
      relations: ['teamMembers'],
    });
    if (!customer) return null;

    if (patchCustomerDto.teamMembers) {
      customer.teamMembers = await this.teamMemberRepository.findBy({
        name: In(patchCustomerDto.teamMembers),
      });
    }
    if (customer) {
      customer.companyName =
        patchCustomerDto.companyName ?? customer.companyName;
      customer.contactName =
        patchCustomerDto.contactName ?? customer.contactName;
      customer.contactEmail =
        patchCustomerDto.contactEmail ?? customer.contactEmail;
      customer.industry = patchCustomerDto.industry ?? customer.industry;
      customer.projectType =
        patchCustomerDto.projectType ?? customer.projectType;
      customer.status = patchCustomerDto.status ?? customer.status;
      customer.deadline = patchCustomerDto.deadline ?? customer.deadline;
      //customer.teamMembers = teamMembers;
    }

    if (customer) {
      await this.customersRepository.save(customer);
    }
    return customer;
  }
}
