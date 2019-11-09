import request from "supertest";
import knex from "../db/knex";
import app from "../src/app";
import User from "../src/models/User";
import { unlock } from "./utils/unlock";

describe("Routes: users", () => {
  let token: string;

  // beforeAll(async done => {
  //   await knex.migrate.rollback();
  //   await knex.migrate.latest();
  //   await knex.seed.run();j
  //   await User.query().insert({
  //     email: "test@gmail.com",
  //     password: "fdjkf",
  //     nick: "tester"
  //   });
  //   done();
  // });

  beforeEach(async () => {
    await unlock(knex);
    return knex.migrate
      .rollback()
      .then(() => knex.migrate.latest())
      .then(() => knex.seed.run())
      .then(async () => {
        const response = await request(app)
          .post("/auth/login")
          .send({
            email: "test01@gmail.com",
            nick: "tester01",
            password: "password"
          });
        token = response.body.token;
      });
  });

  afterEach(async () => {
    return knex.migrate.rollback();
  });

  describe("token testing", () => {
    it("shoud have one user beforehand", async () => {
      const users = await User.query();
      expect(users.length).toBe(1);
    });
    it("should have token beforehand", () => {
      expect(token).toBeDefined();
    });
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

      expect(users.length).toBe(2);
      done();
    });
  });

  describe("POST /user/profile", () => {
    it("should send profile if authenticated", async () => {
      const response = await request(app)
        .get("/user/profile")
        .set("Authorization", `bearer ${token}`);
      expect(response.status).toBe(200);
    });

    it("should NOT send profile if not authenticated", async () => {
      const response = await request(app).get("/user/profile");
      expect(response.status).toBe(401);
    });
  });
});
