import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("posts", (table) => {
    // columns
    table.increments().primary();
    table
      .timestamp("created_at")
      .notNullable()
      .defaultTo(knex.raw("CURRENT_TIMESTAMP"));
    table.string("title", 100).notNullable();
    table.text("content").notNullable();
    table.string("name", 30).notNullable();
    table.string("file_url", 128).nullable();
    table.integer("views").unsigned().notNullable().defaultTo(knex.raw("0"));
    table.integer("user_id").unsigned().nullable();
    table.uuid("uuid").nullable();

    // indexes
    table.unique(["uuid"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("posts");
}
