exports.up = knex => {
  return knex.schema.createTable("users", table => {
    table.increments("id").primary();
    table.string("email", 40).nullable();
    table.string("nick", 15).notNullable();
    table.string("password", 100).nullable();
    table
      .string("provider", 10)
      .notNullable()
      .defaultTo("local");
    table.string("snsId", 30).nullable();
    table.bigInteger("createdAt").notNullable();
    table.bigInteger("updatedAt").notNullable();
  });
};

exports.down = knex => {
  return knex.schema.dropTableIfExists("users");
};
