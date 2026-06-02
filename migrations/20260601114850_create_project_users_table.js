/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.schema.createTable('project_user_role', (table) => {
        table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
        table.integer('project_id').unsigned().references('id').inTable('projects').onDelete('CASCADE');
        table.integer('role_id').unsigned().references('id').inTable('roles').onDelete('CASCADE');
        table.primary(['user_id', 'project_id']);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.schema.dropTable('project_user_role');
};
