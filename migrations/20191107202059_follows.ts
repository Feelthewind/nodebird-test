import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable("follows", table => {
    table.increments("id").primary();
    table
      .integer("followingId")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
      .index();
    table
      .integer("followerId")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
      .index();
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTableIfExists("follows");
}
