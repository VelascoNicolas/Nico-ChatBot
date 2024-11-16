import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ProfileService } from 'src/profile/profile.service';

@Injectable()
export class AuthService {

    constructor(
        private readonly profileService: ProfileService,
        private readonly jwtService: JwtService,
    ) {}

    async signIn(username: string, pass: string): Promise<any> {
        const profile = await this.profileService.findProfileByMail(username);
        if(profile?.password !== pass) {
            throw new UnauthorizedException();
        }

        const {password, ...result} = profile;
        const payload = {sub: profile.id, email: profile.email}

        return {
            data: {
                ...result
            },
            token: await this.jwtService.signAsync(payload),
        }
    }


}
