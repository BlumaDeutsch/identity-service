/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
    await knex('users').del();

    await knex('users').insert([
        {
            username: 'alice_admin',
            email: 'alice@example.com',
            // bcrypt hash of 'Password1!'
            password_hash: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        },
        {
            username: 'bob_dev',
            email: 'bob@example.com',
            // bcrypt hash of 'Password2!'
            password_hash: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        },
        {
            username: 'carol_viewer',
            email: 'carol@example.com',
            // bcrypt hash of 'Password3!'
            password_hash: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        },
        {
            username: 'dave_manager',
            email: 'dave@example.com',
            // bcrypt hash of 'Password4!'
            password_hash: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        },
    ]);
};