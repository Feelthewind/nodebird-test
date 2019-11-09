import { Model, RelationMappings } from "objection";
import BaseModel from "./BaseModel";
import Post from "./Post";
import User from "./User";

export default class Person extends BaseModel {
  // prettier-ignore
  readonly id!: number;
  email?: string;
  nick!: string;
  password?: string;
  provider?: string;
  snsId?: string;
  createdAt?: Date;
  updatedAt?: Date;

  // Optional eager relations.
  posts?: Post[];
  followers?: User[];
  followings?: User[];
  likes?: Post[];

  // Table name is the only required property.
  static tableName = "users";

  // Optional JSON schema. This is not the database schema! Nothing is generated
  // based on this. This is only used for validation. Whenever a model instance
  // is created it is checked against this schema. http://json-schema.org/.
  static jsonSchema = {
    type: "object",
    required: ["nick"],

    properties: {
      id: { type: "integer" },
      email: { type: "string", format: "email", maxLength: 40 },
      nick: { type: "string", minLength: 1, maxLength: 15 },
      password: { type: "string", minLength: 1, maxLength: 100 },
      provider: { type: "string", minLength: 1, maxLength: 10 },
      snsId: { type: "string", minLength: 1, maxLength: 30 }
    }
  };

  // Where to look for models classes.
  static modelPaths = [__dirname];

  // This object defines the relations to other models. The modelClass strings
  // will be joined to `modelPaths` to find the class definition, to avoid
  // require loops. The other solution to avoid require loops is to make
  // relationMappings a thunk. See Movie.ts for an example.
  static relationMappings: RelationMappings = {
    posts: {
      relation: Model.HasManyRelation,
      modelClass: Post,
      join: {
        from: "users.id",
        to: "posts.userId"
      }
    },

    followers: {
      relation: Model.ManyToManyRelation,
      modelClass: User,
      join: {
        from: "users.id",
        through: {
          from: "follows.followingId",
          to: "follows.followerId"
        },
        to: "users.id"
      }
    },

    followings: {
      relation: Model.ManyToManyRelation,
      modelClass: User,
      join: {
        from: "users.id",
        through: {
          from: "follows.followerId",
          to: "follows.followingId"
        },
        to: "users.id"
      }
    },

    likes: {
      relation: Model.ManyToManyRelation,
      modelClass: "Post",
      join: {
        from: "users.id",
        through: {
          from: "likes.userId",
          to: "likes.postId"
        },
        to: "posts.id"
      }
    }
  };
}
