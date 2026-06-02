/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
    await knex('role_permissions').del();

    // ── helpers ──────────────────────────────────────────────────────────────
    const roles       = await knex('roles').join('projects', 'roles.project_id', 'projects.id').select('roles.id', 'roles.name', 'projects.name as project_name');
    const permissions = await knex('permissions').select('id', 'name');

    const roleId = (roleName, projectName) => {
        const r = roles.find((r) => r.name === roleName && r.project_name === projectName);
        if (!r) throw new Error(`Role "${roleName}" in "${projectName}" not found.`);
        return r.id;
    };

    const permId = (name) => {
        const p = permissions.find((p) => p.name === name);
        if (!p) throw new Error(`Permission "${name}" not found.`);
        return p.id;
    };

    // Helper: build role_permissions rows from a list of permission names
    const assign = (roleName, projectName, permNames) =>
        permNames.map((pName) => ({
            role_id:       roleId(roleName, projectName),
            permission_id: permId(pName),
        }));

    // ── permission sets ───────────────────────────────────────────────────────
    const ALL_PERMISSIONS = [
        'users:read', 'users:create', 'users:update', 'users:delete',
        'projects:read', 'projects:create', 'projects:update', 'projects:delete',
        'roles:read', 'roles:create', 'roles:update', 'roles:delete',
        'content:read', 'content:create', 'content:update', 'content:delete',
        'settings:read', 'settings:update',
    ];

    const EDITOR_PERMISSIONS = [
        'content:read', 'content:create', 'content:update', 'content:delete',
        'users:read', 'projects:read', 'roles:read',
    ];

    const DEVELOPER_PERMISSIONS = [
        'content:read', 'content:create', 'content:update', 'content:delete',
        'projects:read', 'projects:update',
        'roles:read', 'users:read',
        'settings:read',
    ];

    const ANALYST_PERMISSIONS = [
        'content:read', 'projects:read', 'users:read', 'settings:read',
    ];

    const VIEWER_PERMISSIONS = [
        'content:read', 'projects:read', 'users:read',
    ];

    // ── assignments ───────────────────────────────────────────────────────────
    const rows = [
        // Main Website
        ...assign('admin',  'Main Website', ALL_PERMISSIONS),
        ...assign('editor', 'Main Website', EDITOR_PERMISSIONS),
        ...assign('viewer', 'Main Website', VIEWER_PERMISSIONS),

        // Mobile App
        ...assign('admin',     'Mobile App', ALL_PERMISSIONS),
        ...assign('developer', 'Mobile App', DEVELOPER_PERMISSIONS),
        ...assign('viewer',    'Mobile App', VIEWER_PERMISSIONS),

        // Internal Dashboard
        ...assign('admin',   'Internal Dashboard', ALL_PERMISSIONS),
        ...assign('analyst', 'Internal Dashboard', ANALYST_PERMISSIONS),
        ...assign('viewer',  'Internal Dashboard', VIEWER_PERMISSIONS),

        // Legacy API
        ...assign('admin',  'Legacy API', ALL_PERMISSIONS),
        ...assign('viewer', 'Legacy API', VIEWER_PERMISSIONS),
    ];

    await knex('role_permissions').insert(rows);
};