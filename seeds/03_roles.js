/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
    await knex('roles').del();

    // Fetch project IDs by name so the seed is not coupled to hard-coded IDs
    const projects = await knex('projects').select('id', 'name');
    const projectId = (name) => {
        const p = projects.find((p) => p.name === name);
        if (!p) throw new Error(`Project "${name}" not found — run projects seed first.`);
        return p.id;
    };

    await knex('roles').insert([
        // Main Website
        { name: 'admin',   project_id: projectId('Main Website') },
        { name: 'editor',  project_id: projectId('Main Website') },
        { name: 'viewer',  project_id: projectId('Main Website') },

        // Mobile App
        { name: 'admin',     project_id: projectId('Mobile App') },
        { name: 'developer', project_id: projectId('Mobile App') },
        { name: 'viewer',    project_id: projectId('Mobile App') },

        // Internal Dashboard
        { name: 'admin',   project_id: projectId('Internal Dashboard') },
        { name: 'analyst', project_id: projectId('Internal Dashboard') },
        { name: 'viewer',  project_id: projectId('Internal Dashboard') },

        // Legacy API
        { name: 'admin',  project_id: projectId('Legacy API') },
        { name: 'viewer', project_id: projectId('Legacy API') },
    ]);
};