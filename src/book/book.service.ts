import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from './schemas/book.schema';
import * as mongoose from 'mongoose';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { User } from 'src/auth/schemas/user.schema';


@Injectable()
export class BookService {
    constructor(
        @InjectModel(Book.name)
        private bookModel: mongoose.Model<Book>
    ) {}

    async findAllBooks(query: ExpressQuery): Promise<Book[]> {
        const responsePerPage = 5
        const currentPage = Number(query.page) || 1
        const skip = responsePerPage * (currentPage - 1)

        const keyword = query.keyword
        ? {
              $or: [
                  { title: { $regex: query.keyword, $options: 'i' } },
                  { author: { $regex: query.keyword, $options: 'i' } },
                  { category: { $regex: query.keyword, $options: 'i' } },
              ],
          }
        : {};

        const books = await this.bookModel
            .find({ ...keyword })
            .limit(responsePerPage)
            .skip(skip);
        return books
    }

    async create(book: Book, user: User): Promise<Book> {
        const data = Object.assign(book, { user: user._id })
        

        const res = await this.bookModel.create(data);
        return res;
    }

    async findById(id: string): Promise<Book> {
        const isValidId = mongoose.isValidObjectId(id)
        if (!isValidId) {
            throw new BadRequestException('Invalid book id ')
        }

        const book = await this.bookModel.findById(id);
        if (!book) {
            throw new NotFoundException('Book not found.')
        }

        return book;
    }

    async updateById(id: string, book: Book): Promise<Book> {
        return await this.bookModel.findByIdAndUpdate(id, book, {
            new: true,
            runValidators: true
        });
    }

    async deleteById(id: string): Promise<Book> {
        return await this.bookModel.findByIdAndDelete(id);
    }
}
