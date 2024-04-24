import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("comments", (table) => {
    // alter column
    table.integer("user_id").unsigned().notNullable().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("comments", (table) => {
    // rollback - alter column
    table.integer("user_id").unsigned().nullable().alter();
  });
}
