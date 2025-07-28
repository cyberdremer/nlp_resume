import prisma from "../config/prisma";
import bcrypt from "bcryptjs";

const seedDb = async () => {
  Promise.all([
    await prisma.user.deleteMany({}),
    await prisma.user.create({
      data: {
        username: "dlara0000",
        fullname: "David Lara",
        email: "dlara0000@gmail.com",
        passwordhash: await bcrypt.hash("H3ll0W0rld$", 16),
      },
    }),
  ]);

  console.log("Database has seeded");
};

seedDb();
