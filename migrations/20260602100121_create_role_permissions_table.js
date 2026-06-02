/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.schema.createTable('role_permissions', (table) => {
        table.integer('role_id').unsigned().notNullable().references('id').inTable('roles').onDelete('CASCADE');
        table.integer('permission_id').unsigned().notNullable().references('id').inTable('permissions').onDelete('CASCADE');
        table.primary(['role_id', 'permission_id']);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.dropTable('role_permissions');
};
