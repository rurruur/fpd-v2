import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("notis", (table) => {
    // alter column
    table.integer("post_id").unsigned().notNullable().alter();
    // alter column
    table.boolean("read").notNullable().defaultTo(knex.raw("false")).alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("notis", (table) => {
    // rollback - alter column
    table.integer("post_id").unsigned().nullable().alter();
    // rollback - alter column
    table.boolean("read").notNullable().defaultTo(knex.raw("0")).alter();
  });
}
