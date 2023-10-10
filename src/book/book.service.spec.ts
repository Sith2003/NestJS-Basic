import { getModelToken } from "@nestjs/mongoose"
import { Test, TestingModule } from "@nestjs/testing"
import mongoose, { Model } from "mongoose"
import { BookService } from "./book.service"
import { Book, Category } from "./schemas/book.schema"
import { BadRequestException, NotFoundException } from "@nestjs/common"
import { CreateBookDto } from "./dto/create-book.dto"
import { User } from "src/auth/schemas/user.schema"


describe('BookService', () => {
    
    let bookService: BookService 
    let model: Model<Book>

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
        find: jest.fn(),
        create: jest.fn(),
        findById: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn()
    }
    beforeEach( async() => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BookService,
                {
                    provide: getModelToken(Book.name),
                    useValue: mockBookService
                }
            ]
        }).compile()

        bookService = module.get<BookService>(BookService)
        model = module.get<Model<Book>>(getModelToken(Book.name))
    })

    describe('findAllBooks', () => {
        it('Should return array of all books', async () => {
            const query = { page: "1", keyword: "test" }

            jest.spyOn(model, 'find').mockImplementation(
                () => 
                    ({ limit: () => ({
                        skip: jest.fn().mockResolvedValue([mockBook])
                    }),
                } as any)
            )

            const result = await bookService.findAllBooks(query)

            expect(model.find).toHaveBeenCalledWith({
                title: { $regex: 'test', $options: 'i' }
            })
            expect(result).toEqual([mockBook])
        })
    })

    // describe('create', () => {
    //     it('Should create and return a book', async () => {
    //         const newBook = {
    //             title : "Harry Potter 8",
    //             description : "Magic's World",
    //             author : "JK Rolling",
    //             price : 250,
    //             category : Category.FANTASY,
    //         }

    //         // jest.spyOn(model, 'create').mockImplementationOnce(() => Promise.resolve(mockBook))

    //         const result = await bookService.create(newBook as CreateBookDto, mockUser as User)

    //         expect(result).toEqual(mockBook)
    //     })
    // })

    describe('findById', () => {
        it('Should find and return a book by ID', async () => {
            jest.spyOn(model, 'findById').mockResolvedValue(mockBook)

            const result = await bookService.findById(mockBook._id)

            expect(model.findById).toHaveBeenCalledWith(mockBook._id)
            expect(result).toEqual(mockBook)
        })

        it('Should throw BadRequestException if invalid ID is provided', async() => {
            const id = 'invalid-id'

            const isValidObjectIDMock = jest
                .spyOn(mongoose, 'isValidObjectId')
                .mockReturnValue(false)

            await expect(bookService.findById(id)).rejects.toThrow(BadRequestException)

            expect(isValidObjectIDMock).toHaveBeenCalledWith(id)
            isValidObjectIDMock.mockRestore()
        })

        it('Should throw NotFoundException if book is not found', async () => {
            jest.spyOn(model, 'findById').mockResolvedValue(null)

            await expect(bookService.findById(mockBook._id)).rejects.toThrow(NotFoundException)

            expect(model.findById).toHaveBeenCalledWith(mockBook._id)
        })
    })

    describe('updateById', () => {
        it('Should update and return a book', async () => {
          const updatedBook = { ...mockBook, title: 'Updated name' };
          const book = { title: 'Updated name' };
    
          jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValue(updatedBook);
    
          const result = await bookService.updateById(mockBook._id, book as any);
    
          expect(model.findByIdAndUpdate).toHaveBeenCalledWith(mockBook._id, book, {
            new: true,
            runValidators: true,
          });
    
          expect(result.title).toEqual(book.title);
        });
      });
    
      describe('deleteById', () => {
        it('Should delete and return a book', async () => {
          jest.spyOn(model, 'findByIdAndDelete').mockResolvedValue(mockBook);
    
          const result = await bookService.deleteById(mockBook._id);
    
          expect(model.findByIdAndDelete).toHaveBeenCalledWith(mockBook._id);
    
          expect(result).toEqual(mockBook);
        });
      });
})