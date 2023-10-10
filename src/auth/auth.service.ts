import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup-auth.dto';

import * as bcrypt from 'bcryptjs';
import { LogInDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
        private jwtService: JwtService
    ) {}

    async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
        try {           
            const { name, email, password } = signUpDto
    
            const hashedPassword = await bcrypt.hash(password, 10)
    
            const user = await this.userModel.create({
                name,
                email,
                password: hashedPassword
            })
    
            const token = this.jwtService.sign({ id: user._id })
    
            const responseData = { user, token }
    
            return responseData
        } catch (error) {
            if (error?.code === 11000) {
                throw new ConflictException('Duplicate Email entered')
            }
        }
    }

    async login(loginDto: LogInDto): Promise<{ token: string }> {
        const { email, password } = loginDto

        const user = await this.userModel.findOne({ email})
        if (!user) {
            throw new UnauthorizedException("Invalid email or password")
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isPasswordMatch) {
            throw new UnauthorizedException("Invalid email or password")
        }

        const token = this.jwtService.sign({ id: user._id })

        // const responseData = { user, token }

        return {token}
    }
}
