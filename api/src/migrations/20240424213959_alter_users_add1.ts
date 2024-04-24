import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("users", (table) => {
    // add
    table.boolean("approval").notNullable().defaultTo(knex.raw("FALSE"));
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("users", (table) => {
    // rollback - add
    table.dropColumns("approval");
  });
}
