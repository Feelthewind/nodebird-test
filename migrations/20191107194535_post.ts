import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable("posts", table => {
    table.increments("id").primary();
    table
      .integer("userId")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("SET NULL")
      .index();
    table.string("content", 140).notNullable();
    table.string("img", 200).nullable();
    table.bigInteger("createdAt").notNullable();
    table.bigInteger("updatedAt").notNullable();
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTableIfExists("posts");
}
