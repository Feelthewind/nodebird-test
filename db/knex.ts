const environment = process.env.NODE_ENV || "development";
import knex from "knex";
import config from "../knexfile";

const environmentConfig = (config as any)[environment];
const connection = knex(environmentConfig);

export default connection;
