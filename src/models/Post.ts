import { Model, RelationMappings } from "objection";
import BaseModel from "./BaseModel";
import User from "./User";
import Hashtag from "./Hashtag";

export default class Post extends BaseModel {
  // prettier-ignore
  readonly id!: number;
  content!: string;
  img?: string;
  userId?: number;
  createdAt?: Date;
  updatedAt?: Date;

  // Optional eager relations.
  hashtags?: Hashtag[];
  user?: User;

  // Table name is the only required property.
  static tableName = "posts";

  // Optional JSON schema. This is not the database schema! Nothing is generated
  // based on this. This is only used for validation. Whenever a model instance
  // is created it is checked against this schema. http://json-schema.org/.
  static jsonSchema = {
    type: "object",
    required: ["content"],

    properties: {
      id: { type: "integer" },
      content: { type: "string", minLength: 1, maxLength: 140 },
      img: { type: "string", maxLength: 200 }
    }
  };

  // Where to look for models classes.
  static modelPaths = [__dirname];

  // This object defines the relations to other models. The modelClass strings
  // will be joined to `modelPaths` to find the class definition, to avoid
  // require loops. The other solution to avoid require loops is to make
  // relationMappings a thunk. See Movie.ts for an example.
  static relationMappings: RelationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: "User",
      join: {
        from: "posts.userId",
        to: "users.id"
      }
    },

    hashtags: {
      relation: Model.ManyToManyRelation,
      modelClass: "Hashtag",
      join: {
        from: "posts.id",
        through: {
          from: "posts_hashtags.postId",
          to: "posts_hashtags.hashtagId"
        },
        to: "hashtags.id"
      }
    }
  };
}
