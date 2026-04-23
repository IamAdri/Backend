import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { TeamMembersService } from 'src/team-members/providers/team-members.service';
import { SignInDto } from '../dtos/signin.dto';
import { SignInProvider } from './sign-in.provider';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { RefreshTokensProvider } from './refresh-tokens.provider';

@Injectable()
export class AuthService {
  constructor(
    /**Injecting teamMembersService */
    @Inject(forwardRef(() => TeamMembersService))
    private readonly teamMembersService: TeamMembersService,
    /**Inject signInProvider */
    private readonly signInProvider: SignInProvider,
    /**Inject refreshTokensProvider */
    private readonly refreshTokensProvider: RefreshTokensProvider,
  ) {}
  public async signIn(signInDto: SignInDto) {
    return await this.signInProvider.signIn(signInDto);
  }

  public async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    return await this.refreshTokensProvider.refreshTokens(refreshTokenDto);
  }
}
