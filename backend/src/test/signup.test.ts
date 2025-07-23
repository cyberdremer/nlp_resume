import test, {describe, beforeEach } from "node:test";
import prisma from "../config/prisma";
import request from "supertest";
import app from "../server/server";
import { query } from "express-validator";

beforeAll(async () => {
  await prisma.user.deleteMany({});
  await prisma.feedback.deleteMany({});
  await prisma.resume.deleteMany({});
});

describe("POST /signup", () => {
  const testCases = [
    {
      query: {
        firstname: "David",
        lastname: "Lara",
        email: "dlara0000@gmail.com",
        password: "H3ll0W0rld$",
        confirmpassword: "H3ll0W0rld$",
      },
      test: "Valid information signup",
      expectedStatus: 201,
    },

    {
      query: {
        lastname: "Lara",
        email: "dlara0000@gmail.com",
        password: "H3ll0W0rld$",
        confirmpassword: "H3ll0W0rld$",
      },
      test: "Missing one field",

      expectedStatus: 400,
    },

    {
      query: {
        firstname: "David",
        lastname: "Lara",
        email: "dlara0000@gmail.com",
        password: "123456789",
        confirmpassword: "123456789",
      },
      test: "Testing invalid password",
      expectedStatus: 400,
    },

    {
      query: {
        firstname: "David",
        lastname: "Lara",
        email: "dlara0000@gmail.com",
        password: "H3ll0W0rld$",
        confirmpassword: "123456789",
      },
      test: "Valid password, but password doesn't match confirm password field",
      expectedStatus: 400,
    },
  ];

  testCases.forEach((testCase) => {
    it(
      testCase.test,
      (done) => {
        request(app)
          .post("/signup")
          .type("form")
          .send(testCase.query)
          .expect(testCase.expectedStatus, done);
      },
      10000
    );
  });
});
