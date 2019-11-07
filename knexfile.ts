module.exports = {
  test: {
    client: "sqlite3",
    useNullAsDefault: true,
    connection: {
      filename: "./example.db"
    }
    // pool: {
    // //   afterCreate: (conn: any, cb: any) => {
    // //     conn.run("PRAGMA foreign_keys = ON", cb);
    // //   }
    // // }
  },

  development: {
    client: "postgresql",
    connection: {
      database: "nodebird",
      user: "postgres",
      password: "password"
    },
    pool: {
      min: 2,
      max: 10
    }
  }
};
