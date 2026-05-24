/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('users', (table) => {
        table.increments('id').primary(); // מפתח ראשי אוטומטי
        table.string('username', 50).notNullable();
        table.string('email', 100).notNullable().unique();
        table.string('password_hash').notNullable();
        table.timestamps(true, true); // יוצר created_at ו-updated_at אוטומטית
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('users');
};
