import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { TeamMember } from 'src/team-members/team-member.entity';
import { ActiveTeamMemberData } from '../interfaces/active-team-member-data.interface';

@Injectable()
export class GenerateTokensProvider {
  constructor(
    /**Inject jwtService */
    private readonly jwtService: JwtService,
    /**Inject jwtConfiguration */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}
  public async signToken<T>(
    teamMemberId: number,
    expiresIn: number,
    payload?: T,
  ) {
    return await this.jwtService.signAsync(
      {
        sub: teamMemberId,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }

  public async generateTokens(teamMember: TeamMember) {
    const [accessToken, refreshToken] = await Promise.all([
      //Generate access token
      this.signToken<Partial<ActiveTeamMemberData>>(
        teamMember.id,
        this.jwtConfiguration.accessTokenTtl,
        {
          email: teamMember.contactEmail,
        },
      ),
      //Generate refresh token
      this.signToken(teamMember.id, this.jwtConfiguration.refreshTokenTtl),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }
}
