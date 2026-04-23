import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import type { ConfigType } from '@nestjs/config';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { TeamMembersService } from 'src/team-members/providers/team-members.service';
import { ActiveTeamMemberData } from '../interfaces/active-team-member-data.interface';

@Injectable()
export class RefreshTokensProvider {
  constructor(
    /**Inject jwtService */
    private readonly jwtService: JwtService,
    /**Inject jwtConfiguration */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    /**Inject generateTokensProvider */
    private readonly generateTokensProvider: GenerateTokensProvider,
    /**Inject teamMembersService */
    @Inject(forwardRef(() => TeamMembersService))
    private readonly teamMembersService: TeamMembersService,
  ) {}
  public async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      //Verify refresh token using jwtService
      const { sub } = await this.jwtService.verifyAsync<
        Pick<ActiveTeamMemberData, 'sub'>
      >(refreshTokenDto.refreshToken, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      });
      //Fetch team member from DB
      const teamMember = await this.teamMembersService.findOneById(sub);
      //Generate the tokens
      return await this.generateTokensProvider.generateTokens(teamMember);
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }
}
