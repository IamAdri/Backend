import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTeamMemberDto } from './dtos/create-team-member.dto';
import { TeamMembersService } from './providers/team-members.service';
import { GetTeamMembersDto } from './dtos/get-team-members.dto';
import { PatchTeamMemberDto } from './dtos/patch-team-member.dto';

@Controller('team-members')
export class TeamMembersController {
  constructor(
    /**Inbject teamMembersService */
    private readonly teamMembersService: TeamMembersService,
  ) {}
  @Get()
  public getAllTeamMembers(@Query() teamMemberQuery: GetTeamMembersDto) {
    return this.teamMembersService.getAll(teamMemberQuery);
  }
  @Get('names')
  public getAllTeamMembersNames() {
    return this.teamMembersService.getNames();
  }
  @Post()
  public createTeamMember(@Body() createTeamMemberDto: CreateTeamMemberDto) {
    return this.teamMembersService.create(createTeamMemberDto);
  }
  @Delete(':id')
  public deleteTeamMember(@Param('id', ParseIntPipe) id: number) {
    return this.teamMembersService.delete(id);
  }
  @Patch(':id')
  public updateTeamMember(
    @Body() patchTeamMemberDto: PatchTeamMemberDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.teamMembersService.update(patchTeamMemberDto, id);
  }
}
