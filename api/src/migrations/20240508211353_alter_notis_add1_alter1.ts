import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("notis", (table) => {
    // add
    table.string("content", 256).notNullable();
    // alter column
    table.boolean("read").notNullable().defaultTo(knex.raw("false")).alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("notis", (table) => {
    // rollback - add
    table.dropColumns("content");
    // rollback - alter column
    table.boolean("read").notNullable().defaultTo(knex.raw("0")).alter();
  });
}
