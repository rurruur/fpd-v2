import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("notis", (table) => {
    // add
    table.boolean("read").notNullable().defaultTo(knex.raw("false"));
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("notis", (table) => {
    // rollback - add
    table.dropColumns("read");
  });
}
