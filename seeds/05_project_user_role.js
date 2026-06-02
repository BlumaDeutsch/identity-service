/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
    await knex('project_user_role').del();

    // ── helpers ──────────────────────────────────────────────────────────────
    const users    = await knex('users').select('id', 'username');
    const projects = await knex('projects').select('id', 'name');
    const roles    = await knex('roles')
        .join('projects', 'roles.project_id', 'projects.id')
        .select('roles.id', 'roles.name', 'projects.name as project_name');

    const userId = (username) => {
        const u = users.find((u) => u.username === username);
        if (!u) throw new Error(`User "${username}" not found.`);
        return u.id;
    };

    const projectId = (name) => {
        const p = projects.find((p) => p.name === name);
        if (!p) throw new Error(`Project "${name}" not found.`);
        return p.id;
    };

    const roleId = (roleName, projectName) => {
        const r = roles.find((r) => r.name === roleName && r.project_name === projectName);
        if (!r) throw new Error(`Role "${roleName}" in "${projectName}" not found.`);
        return r.id;
    };

    // ── assignments ───────────────────────────────────────────────────────────
    // NOTE: primary key is (user_id, project_id) → each user can have only one
    // role per project. Adjust the role assignment to fit your business logic.
    await knex('project_user_role').insert([
        // alice_admin — admin on Main Website and Mobile App
        {
            user_id:    userId('alice_admin'),
            project_id: projectId('Main Website'),
            role_id:    roleId('admin', 'Main Website'),
        },
        {
            user_id:    userId('alice_admin'),
            project_id: projectId('Mobile App'),
            role_id:    roleId('admin', 'Mobile App'),
        },

        // bob_dev — editor on Main Website, developer on Mobile App
        {
            user_id:    userId('bob_dev'),
            project_id: projectId('Main Website'),
            role_id:    roleId('editor', 'Main Website'),
        },
        {
            user_id:    userId('bob_dev'),
            project_id: projectId('Mobile App'),
            role_id:    roleId('developer', 'Mobile App'),
        },

        // carol_viewer — viewer on all active projects
        {
            user_id:    userId('carol_viewer'),
            project_id: projectId('Main Website'),
            role_id:    roleId('viewer', 'Main Website'),
        },
        {
            user_id:    userId('carol_viewer'),
            project_id: projectId('Mobile App'),
            role_id:    roleId('viewer', 'Mobile App'),
        },
        {
            user_id:    userId('carol_viewer'),
            project_id: projectId('Internal Dashboard'),
            role_id:    roleId('viewer', 'Internal Dashboard'),
        },

        // dave_manager — admin on Internal Dashboard, analyst on Mobile App
        {
            user_id:    userId('dave_manager'),
            project_id: projectId('Internal Dashboard'),
            role_id:    roleId('admin', 'Internal Dashboard'),
        },
        {
            user_id:    userId('dave_manager'),
            project_id: projectId('Mobile App'),
            role_id:    roleId('viewer', 'Mobile App'),
        },
    ]);
};