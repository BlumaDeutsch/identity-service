/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.schema.createTable('projects', (table) => {
        table.increments('id').primary();
        table.uuid('uuid').unique().defaultTo(knex.raw('gen_random_uuid()'));
        table.string('name').notNullable();
        table.text('description');
        table.boolean('is_active').defaultTo(true);
        table.string('api_key').unique().notNullable();
        table.timestamps(true, true);
        table.timestamp('last_used_at');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.dropTable('projects');
};
