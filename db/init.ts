import { Model } from "objection";
import Knex from "knex";
const environment = process.env.NODE_ENV || "development";

const knexConfig = require("../knexfile");

const knex = Knex(knexConfig[environment]);
if (process.env.NODE_ENV !== "test") {
  knex.migrate.latest();
}
// knex.migrate.rollback(undefined, true);
Model.knex(knex);
