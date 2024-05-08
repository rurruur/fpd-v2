import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("notis", (table) => {
    // create fk
    table
      .foreign("user_id")
      .references("users.id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table
      .foreign("post_id")
      .references("posts.id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("notis", (table) => {
    // drop fk
    table.dropForeign(["user_id"]);
    table.dropForeign(["post_id"]);
  });
}
