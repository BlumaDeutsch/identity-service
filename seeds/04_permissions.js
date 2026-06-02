/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
    await knex('permissions').del();

    await knex('permissions').insert([
        // User management
        { name: 'users:read',   description: 'View user profiles and list users.' },
        { name: 'users:create', description: 'Create new user accounts.' },
        { name: 'users:update', description: 'Edit existing user accounts.' },
        { name: 'users:delete', description: 'Remove user accounts.' },

        // Project management
        { name: 'projects:read',   description: 'View project details.' },
        { name: 'projects:create', description: 'Create new projects.' },
        { name: 'projects:update', description: 'Edit project settings.' },
        { name: 'projects:delete', description: 'Delete projects.' },

        // Role management
        { name: 'roles:read',   description: 'View roles within a project.' },
        { name: 'roles:create', description: 'Create new roles within a project.' },
        { name: 'roles:update', description: 'Edit existing roles.' },
        { name: 'roles:delete', description: 'Delete roles.' },

        // Content / data access
        { name: 'content:read',   description: 'Read content and data.' },
        { name: 'content:create', description: 'Create new content or records.' },
        { name: 'content:update', description: 'Edit existing content.' },
        { name: 'content:delete', description: 'Delete content.' },

        // System settings
        { name: 'settings:read',   description: 'View system configuration.' },
        { name: 'settings:update', description: 'Modify system configuration.' },
    ]);
};