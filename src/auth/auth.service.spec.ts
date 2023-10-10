import { getModelToken } from "@nestjs/mongoose"
import { Test, TestingModule } from "@nestjs/testing"
import mongoose, { Model } from "mongoose"
import { AuthService } from "./auth.service"
import { User } from "./schemas/user.schema"
import { JwtService } from "@nestjs/jwt"
import * as bcrypt from "bcryptjs"
import { response } from "express"
import { ConflictException, UnauthorizedException } from "@nestjs/common"


describe('AuthService', () => {
    
    let authService: AuthService 
    let model: Model<User>
    let jwtService: JwtService

    const mockUser = {
        // _id : "64e32373cd17abd8de25a6fa",
        name: "Sith2",
        email : "sith2@gmail.com",
        password : "sithhh"
    }

    let token = 'jwtToken'

    const mockAuthService = {
        create: jest.fn(),
        findOne: jest.fn()
    }
    beforeEach( async() => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                JwtService,
                {
                    provide: getModelToken(User.name),
                    useValue: mockAuthService
                }
            ]
        }).compile()

        authService = module.get<AuthService>(AuthService)
        model = module.get<Model<User>>(getModelToken(User.name))
        jwtService = module.get<JwtService>(JwtService)
    })

    describe('signUp', () => {
        const signUpDto = {
            "name": "Sith2",
            "email": "sith2@gmail.com",
            "password": "sithhh"
        }
        
        // it('Should register a new user', async() => {
        //     jest.spyOn(bcrypt, 'hash').moclResolveValue('hashedPassword')

        //     jest.spyOn(model, 'create').mockImplementationOnce(() => Promise.resolve(mockUser))
        //     jest.spyOn(jwtService, 'sign').mockReturnValue('jwtToken')

        //     const result = await authService.signUp(signUpDto)

        //     const expectedResponseData = {
        //         user: mockUser,
        //         token: token
        //     };

        //     expect(bcrypt.hash).toHaveBeenCalled()
        //     expect(result).toEqual(expectedResponseData)
        // })

        it('Should throw Duplicate Email entered', async() => {
            jest.spyOn(model, 'create').mockImplementationOnce(() => Promise.reject({code: 11000}))

            await expect(authService.signUp(signUpDto)).rejects.toThrow(ConflictException)
        })
    })

    describe('login', () => {
        const loginDto = {
            "email": "sith2@gmail.com",
            "password": "sithhh"
        }

        it('Should Login user and return token', async () => {
            jest.spyOn(model, 'findOne').mockResolvedValueOnce(mockUser)
            jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true)
            jest.spyOn(jwtService, 'sign').mockReturnValue(token)

            const result = await authService.login(loginDto)

            const expectedResponseData = {
                    user: mockUser,
                    token: token
                };

            expect(result).toEqual(expectedResponseData);
        })

        it('Should Throw Invalid Email Error', async () => {
            jest.spyOn(model, 'findOne').mockResolvedValueOnce(null)

            expect(authService.login(loginDto)).rejects.toThrow(UnauthorizedException)
        })

        it('Should Throw Invalid Password Error', async () => {
            jest.spyOn(model, 'findOne').mockResolvedValueOnce(mockUser)
            jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false)

            expect(authService.login(loginDto)).rejects.toThrow(UnauthorizedException)
        })
    })
})