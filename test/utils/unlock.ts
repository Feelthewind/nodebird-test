import Knex = require("knex");

export async function unlock(connection: Knex) {
  return connection.schema
    .hasTable("knex_migrations_lock")
    .then(async (exists: boolean) => {
      if (exists) {
        await connection("knex_migrations_lock")
          .where("is_locked", "1")
          .del();
      }
    });
}
