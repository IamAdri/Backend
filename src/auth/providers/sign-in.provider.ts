import {
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from '../dtos/signin.dto';
import { TeamMembersService } from 'src/team-members/providers/team-members.service';
import { HashingProvider } from './hashing.provider';
import { GenerateTokensProvider } from './generate-tokens.provider';

@Injectable()
export class SignInProvider {
  constructor(
    /**Inject teamMembersService */
    @Inject(forwardRef(() => TeamMembersService))
    private readonly teamMembersService: TeamMembersService,
    /**Inject hashingProvider */
    private readonly hashingProvider: HashingProvider,
    /**Inject generateTokensProvider */
    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}
  public async signIn(signInDto: SignInDto) {
    //Find the user using email ID
    //Throw an exception if user not found
    let teamMember = await this.teamMembersService.findOneByEmail(
      signInDto.contactEmail,
    );
    //Compare password sent to the hash
    let isEqual: boolean = false;
    try {
      isEqual = await this.hashingProvider.comparePassword(
        signInDto.password,
        teamMember.password,
      );
    } catch (err) {
      throw new RequestTimeoutException(err, {
        description: 'Could not compare passwords!',
      });
    }
    if (!isEqual) {
      throw new UnauthorizedException('Incorrect password!');
    }
    //Send confirmation
    return await this.generateTokensProvider.generateTokens(teamMember);
  }
}
