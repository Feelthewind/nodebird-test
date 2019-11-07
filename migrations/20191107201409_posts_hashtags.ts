import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable("posts_hashtags", table => {
    table.increments("id").primary();
    table
      .integer("postId")
      .unsigned()
      .references("id")
      .inTable("posts")
      .onDelete("CASCADE")
      .index();
    table
      .integer("hashtagId")
      .unsigned()
      .references("id")
      .inTable("hashtags")
      .onDelete("CASCADE")
      .index();
    table.bigInteger("createdAt").notNullable();
    table.bigInteger("updatedAt").notNullable();
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTableIfExists("posts_hashtags");
}
