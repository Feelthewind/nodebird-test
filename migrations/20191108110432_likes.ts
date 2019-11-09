import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable("likes", table => {
    table.increments("id").primary();
    table
      .integer("userId")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
      .index();
    table
      .integer("postId")
      .unsigned()
      .references("id")
      .inTable("posts")
      .onDelete("CASCADE")
      .index();
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTableIfExists("likes");
}
