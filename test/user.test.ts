import request from "supertest";
import knex from "../db/knex";
import app from "../src/app";
import User from "../src/models/User";
import { unlock } from "./utils/unlock";

describe("Routes: users", () => {
  // beforeAll(() => {
  //   return knex.migrate.rollback(undefined, true);
  // });

  beforeEach(async () => {
    // await unlock(knex);
    return knex.migrate.rollback().then(() => knex.migrate.latest());
    // .then(() => knex.seed.run());
  });

  afterEach(async () => {
    return knex.migrate.rollback();
  });

  describe("POST /auth/join", () => {
    test("Should insert single user", async done => {
      const user: Partial<User> = {
        email: "test@test.com",
        nick: "tester",
        password: "password"
      };
      await request(app)
        .post("/auth/join")
        .send(user);
      const users = await User.query();

      expect(users.length).toBe(1);
      done();
    });
  });
});
