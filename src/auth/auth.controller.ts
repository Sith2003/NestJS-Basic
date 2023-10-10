import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup-auth.dto';
import { LogInDto } from './dto/login-auth.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) {}

    @Post('/signup')
    signUp(@Body() signUpDto: SignUpDto): Promise<{ token: string }> {
        return this.authService.signUp(signUpDto)
    }

    @Post('/login')
    login(@Body() loginDto: LogInDto): Promise<{ token: string }> {
        return this.authService.login(loginDto)
    }
}
