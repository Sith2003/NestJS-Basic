import { Test, TestingModule } from "@nestjs/testing"
import { BookController } from "./book.controller"
import { BookService } from "./book.service"
import { Book, Category } from "./schemas/book.schema"
import { PassportModule } from "@nestjs/passport"
import { CreateBookDto } from "./dto/create-book.dto"
import { User } from "src/auth/schemas/user.schema"
import { UpdateBookDto } from "./dto/update-book.dto"


describe('BookController', () => {
    
    let bookService: BookService 
    let bookController: BookController

    const mockBook = {
        _id : "64e32a90c74f224019d4d71f",
        user : "64e3231faafeab41a2398a24",
        title : "Harry Potter 8",
        description : "Magic's World",
        author : "JK Rolling",
        price : 250,
        category : Category.FANTASY,
    }

    const mockUser = {
        _id : "64e32373cd17abd8de25a6fa",
        name: "Sith2",
        email : "sith2@gmail.com",
        password : "sithhh"
    }

    const mockBookService = {
        findAllBooks: jest.fn().mockResolvedValueOnce([mockBook]),
        create: jest.fn(),
        findById: jest.fn().mockResolvedValueOnce(mockBook),
        updateById: jest.fn(),
        deleteById: jest.fn().mockResolvedValueOnce(mockBook)
    }
    beforeEach( async() => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
            controllers: [BookController],
            providers: [
                {
                    provide: BookService,
                    useValue: mockBookService
                }
            ]
        }).compile()

        bookService = module.get<BookService>(BookService)
        bookController = module.get<BookController>(BookController)
    })

    it('Should be defined', () => {
        expect(bookController).toBeDefined()
    })

    describe('getAllBooks', () => {
        it('Should get all books', async() => {
            const result = await bookController.getAllBooks({ page: '1', keyword: 'test'})

            expect(bookService.findAllBooks).toHaveBeenCalled()
            expect(result).toEqual([mockBook])
        })
    })

    describe('createBook', () => {
        it('Should create a new book', async() => {
            const newBook = {
                title : "Harry Potter 8",
                description : "Magic's World",
                author : "JK Rolling",
                price : 250,
                category : Category.FANTASY,
            }

            mockBookService.create = jest.fn().mockResolvedValueOnce(mockBook)

            const result = await bookController.createBook(
                newBook as CreateBookDto, 
                mockUser as User 
            )

            expect(bookService.create).toHaveBeenCalled()
            expect(result).toEqual(mockBook)
        })
    })

    describe('getBook', () => {
        it('Should get a book by ID', async() => {
            const result = await bookController.getBook(mockBook._id)

            expect(bookService.findById).toHaveBeenCalled()
            expect(result).toEqual(mockBook)
        })
    })

    describe('updateBook', () => {
        it('Should update a book by ID', async() => {
            const updatedBook = { ...mockBook, title: 'Harry Potter 8' }
            const book = { title: 'Harry Potter 8' }

            mockBookService.updateById = jest.fn().mockReturnValueOnce(updatedBook)

            const result = await bookController.updateBook(mockBook._id, book as UpdateBookDto)

            expect(bookService.updateById).toHaveBeenCalled()
            expect(result).toEqual(mockBook)
        })
    })

    describe('deleteBook', () => {
        it('Should delete a book by ID', async() => {
            const result = await bookController.deleteBook(mockBook._id)

            expect(bookService.deleteById).toHaveBeenCalled()
            expect(result).toEqual(mockBook)
        })
    })
})