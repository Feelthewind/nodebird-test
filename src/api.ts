import { transaction } from "objection";
import * as express from "express";
import Person from "./models/Person";

export default (router: express.Router) => {
  router.post("/persons", async (req, res) => {
    const graph = req.body;

    // It's a good idea to wrap `insertGraph` call in a transaction since it
    // may create multiple queries.
    const insertedPerson = await transaction(Person.knex(), trx => {
      return Person.query(trx).insert(graph);
      // // For security reasons, limit the relations that can be inserted.
      // .allowInsert('[pets, children.[pets, movies], movies, parent]')
      // .insertGraph(graph)
    });

    res.send(insertedPerson);
  });
};

// The error returned by this function is handled in the error handler middleware in app.js.
function createStatusCodeError(statusCode: number) {
  return Object.assign(new Error(), {
    statusCode
  });
}
