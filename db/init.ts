import { Model } from "objection";
import Knex from "knex";

import knexConfig from "../knexfile";

const knex = Knex(knexConfig.development);
knex.migrate.latest();
Model.knex(knex);
