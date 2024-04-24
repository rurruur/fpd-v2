import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("users", (table) => {
    // alter column
    table
      .boolean("approval")
      .notNullable()
      .defaultTo(knex.raw("FALSE"))
      .alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("users", (table) => {
    // rollback - alter column
    table.boolean("approval").notNullable().defaultTo(knex.raw("0")).alter();
  });
}
