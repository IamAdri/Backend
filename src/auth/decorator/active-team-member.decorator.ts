import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ActiveTeamMemberData } from '../interfaces/active-team-member-data.interface';
import { REQUEST_TEAM_MEMBER_KEY } from '../constants/auth.constants';

export const ActiveTeamMember = createParamDecorator(
  (field: keyof ActiveTeamMemberData | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const teamMember: ActiveTeamMemberData = request[REQUEST_TEAM_MEMBER_KEY];
    return field ? teamMember?.[field] : teamMember;
  },
);
