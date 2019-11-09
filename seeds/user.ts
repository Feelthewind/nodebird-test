import * as Knex from "knex";
import bcrpyt from "bcrypt";

export async function seed(knex: Knex): Promise<any> {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(async () => {
      // Inserts seed entries
      return knex("users").insert([
        {
          email: "test01@gmail.com",
          nick: "tester01",
          password: bcrpyt.hashSync("password", 12),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
    });
}
