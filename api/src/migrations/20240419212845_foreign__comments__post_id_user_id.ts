import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("comments", (table) => {
    // create fk
    table
      .foreign("post_id")
      .references("posts.id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table
      .foreign("user_id")
      .references("users.id")
      .onUpdate("CASCADE")
      .onDelete("SET NULL");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("comments", (table) => {
    // drop fk
    table.dropForeign(["post_id"]);
    table.dropForeign(["user_id"]);
  });
}
