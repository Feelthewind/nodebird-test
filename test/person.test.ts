import request from "supertest";
import knex from "../db/knex";
import app from "../src/app";

describe("Routes: persons", () => {
  beforeEach(() => {
    return knex.migrate.rollback().then(() => knex.migrate.latest());
    // .then(() => knex.seed.run());
  });

  afterEach(() => {
    return knex.migrate.rollback();
  });

  describe("POST /posts", () => {
    test("Should return single idea after insert", async () => {
      const data = { firstName: "lim", lastName: "changsu" };
      //     "firstName": "lim",
      // "lastName": "changsu",
      // "age": 34,
      // "address": {
      //   "street": "test street",
      //   "city": "test city",
      //   "zipCode": "test zipCode"
      // },
      const res = await request(app)
        .post("/persons")
        .send(data);
      expect(res.status).toBe(404);
      // expect(res.body).toMatchObject(data);
    });
  });
});
