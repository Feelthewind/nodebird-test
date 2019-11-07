import { Model, RelationMappings } from "objection";
import BaseModel from "./BaseModel";

export default class Hashtag extends BaseModel {
  // prettier-ignore
  readonly id!: number;
  title!: string;
  createdAt?: Date;
  updatedAt?: Date;

  // Optional eager relations.
  // parent?: Person;
  // children?: Person[];

  // Table name is the only required property.
  static tableName = "hashtags";

  // Optional JSON schema. This is not the database schema! Nothing is generated
  // based on this. This is only used for validation. Whenever a model instance
  // is created it is checked against this schema. http://json-schema.org/.
  static jsonSchema = {
    type: "object",
    required: ["title"],

    properties: {
      id: { type: "integer" },
      title: { type: "string", minLength: 1, maxLength: 15 }
    }
  };

  // Where to look for models classes.
  static modelPaths = [__dirname];

  // This object defines the relations to other models. The modelClass strings
  // will be joined to `modelPaths` to find the class definition, to avoid
  // require loops. The other solution to avoid require loops is to make
  // relationMappings a thunk. See Movie.ts for an example.
  // static relationMappings: RelationMappings = {
  //   children: {
  //     relation: Model.HasManyRelation,
  //     modelClass: Person,
  //     join: {
  //       from: "persons.id",
  //       to: "persons.parentId"
  //     }
  //   },

  //   parent: {
  //     relation: Model.BelongsToOneRelation,
  //     modelClass: Person,
  //     join: {
  //       from: "persons.parentId",
  //       to: "persons.id"
  //     }
  //   }
  // };
}
