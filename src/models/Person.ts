import { Model, RelationMappings } from "objection";
import BaseModel from "./BaseModel";

export interface Address {
  street: string;
  city: string;
  zipCode: string;
}

export default class Person extends BaseModel {
  // prettier-ignore
  readonly id!: number;
  parentId?: number;
  firstName?: string;
  lastName?: string;
  age?: number;
  address?: Address;
  createdAt?: Date;
  updatedAt?: Date;

  // Optional eager relations.
  parent?: Person;
  children?: Person[];

  // Table name is the only required property.
  static tableName = "persons";

  // Optional JSON schema. This is not the database schema! Nothing is generated
  // based on this. This is only used for validation. Whenever a model instance
  // is created it is checked against this schema. http://json-schema.org/.
  static jsonSchema = {
    type: "object",
    required: ["firstName", "lastName"],

    properties: {
      id: { type: "integer" },
      parentId: { type: ["integer", "null"] },
      firstName: { type: "string", minLength: 1, maxLength: 255 },
      lastName: { type: "string", minLength: 1, maxLength: 255 },
      age: { type: "number" },

      address: {
        type: "object",
        properties: {
          street: { type: "string" },
          city: { type: "string" },
          zipCode: { type: "string" }
        }
      }
    }
  };

  // Where to look for models classes.
  static modelPaths = [__dirname];

  // This object defines the relations to other models. The modelClass strings
  // will be joined to `modelPaths` to find the class definition, to avoid
  // require loops. The other solution to avoid require loops is to make
  // relationMappings a thunk. See Movie.ts for an example.
  static relationMappings: RelationMappings = {
    children: {
      relation: Model.HasManyRelation,
      modelClass: Person,
      join: {
        from: "persons.id",
        to: "persons.parentId"
      }
    },

    parent: {
      relation: Model.BelongsToOneRelation,
      modelClass: Person,
      join: {
        from: "persons.parentId",
        to: "persons.id"
      }
    }
  };

  examplePersonMethod(arg: string): number {
    return 1;
  }
}
