import { describe } from "node:test";
import request from "supertest";
import bcrypt from "bcryptjs";
import prisma from "../config/prisma";
import app from "../server/server";

beforeAll(async () => {
  Promise.all([
    await prisma.user.deleteMany({}),
    await prisma.user.create({
      data: {
        fullname: "David Lara",
        email: "dlara0000@gmail.com",
        passwordhash: await bcrypt.hash("H3ll0W0rld$", 16),
      },
    }),
  ]);
});

describe("POST /login", () => {
  const testSuites = [
    {
      test: "Login with valid credentials",
      query: {
        email: "dlara0000@gmail.com",
        password: "H3ll0W0rld$",
      },
      expectedStatus: 200,
    },

    {
      test: "Try logging in with valid email, but invalid password",
      query: {
        email: "dlara0000@gmail.com",
        password: "123456789",
      },
      expectedStatus: 400,
    },

    {
      test: "Attempting a login with invalid credentials",
      query: {
        email: "P0000@gmail.com",
        password: "12304894",
      },
      expectedStatus: 400,
    },
  ];

  testSuites.forEach((testSuite) => {
    it(
      testSuite.test,
      (done) => {
        request(app)
          .post("/login")
          .type("form")
          .send(testSuite.query)
          .expect(testSuite.expectedStatus, done);
      },
      10000
    );
  });
});
