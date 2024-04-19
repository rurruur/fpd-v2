import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("users", (table) => {
    // columns
    table.increments().primary();
    table
      .timestamp("created_at")
      .notNullable()
      .defaultTo(knex.raw("CURRENT_TIMESTAMP"));
    table.string("name", 30).notNullable();
    table.string("nickname", 30).notNullable();
    table.string("phone", 20).notNullable();
    table.string("password", 128).notNullable();
    table.string("role", 20).notNullable().defaultTo("normal");
    table.uuid("uuid").nullable();

    // indexes
    table.unique(["uuid"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("users");
}
