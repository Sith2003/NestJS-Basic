import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import mongoose from 'mongoose';

describe('Book & Auth Controller (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    await mongoose.connect(process.env.MONGO_DB) 
    await mongoose.connection.db.dropDatabase()
  })

  afterAll(() => mongoose.disconnect());

  const user = {
    name: "Sith",
    email: "sith@gmail.com",
    password: "sithhh"
  }

  it('(POST) - Register a new user', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send(user)
      .expect(200)
      .then((res) => {
        expect(res.body.token).toBeDefined()
      })
  });
});
