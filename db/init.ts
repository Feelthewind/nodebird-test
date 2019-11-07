import { Model } from "objection";
import Knex from "knex";

const knexConfig = require("../knexfile");

const knex = Knex(knexConfig.development);
knex.migrate.latest();
// knex.migrate.rollback(undefined, true);
Model.knex(knex);
