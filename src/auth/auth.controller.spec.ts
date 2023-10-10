import { Test, TestingModule } from "@nestjs/testing"
import { AuthService } from "./auth.service"
import { AuthController } from "./auth.controller"


describe('AuthController', () => {
    
    let authService: AuthService 
    let authController: AuthController

    const mockUser = {
        _id : "64e32373cd17abd8de25a6fa",
        name: "Sith2",
        email : "sith2@gmail.com",
        password : "sithhh"
    }

    let jwtToken = 'jwtToken'

    const mockAuthService = {
        signUp: jest.fn().mockResolvedValueOnce(jwtToken),
        login: jest.fn().mockResolvedValueOnce(jwtToken)
    }
    beforeEach( async() => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: mockAuthService
                }
            ]
        }).compile()

        authService = module.get<AuthService>(AuthService)
        authController = module.get<AuthController>(AuthController)
    })

    it('Should be defined', () => {
        expect(authController).toBeDefined()
    })

    describe('signUp', () => {
        it('Should register a new user', async() => {
            const signUpDto = {
                "name": "Sith2",
                "email": "sith2@gmail.com",
                "password": "sithhh"
            }

            const result = await authController.signUp(signUpDto)

            expect(authService.signUp).toHaveBeenCalled()
            expect(result).toEqual(jwtToken)
        })
    })

    describe('login', () => {
        it('Should login user', async() => {
            const loginDto = {
                "email": "sith2@gmail.com",
                "password": "sithhh"
            }

            const result = await authController.login(loginDto)

            expect(authService.login).toHaveBeenCalled()
            expect(result).toEqual(jwtToken)
        })
    })
})