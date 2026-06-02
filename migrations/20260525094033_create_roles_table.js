/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.schema.createTable('roles', (table) => {
        table.increments('id').primary();
        table.uuid('uuid').unique().defaultTo(knex.raw('gen_random_uuid()'));
        table.string('name').notNullable();
        table.integer('project_id').unsigned().notNullable().references('id').inTable('projects').onDelete('CASCADE');
        table.timestamps(true, true);
        table.unique(['name', 'project_id']);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.dropTable('roles');
};
