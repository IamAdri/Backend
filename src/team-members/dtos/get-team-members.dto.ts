import { IntersectionType } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';

class GetTeamMembersBaseDto {}

export class GetTeamMembersDto extends IntersectionType(
  GetTeamMembersBaseDto,
  PaginationQueryDto,
) {}
