const express = require('express');
const authenticateToken = require("../middleware/auth");
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const saltRounds = 10;


module.exports = (knex) => {
    const router = express.Router();
    const publicFields = ['uuid', 'name', 'description', 'owner_id'];
    const projectFields = ['name', 'description', 'is_active', 'owner_id', 'api_key'];

    router.get('/', authenticateToken, async (req, res, next) => { // get all projects
        try {
            console.log("get all projects");

            const projects = await knex('projects').select(publicFields).orderBy('updated_at', 'asc');
            res.json(projects);
        } catch (err) {
            next(err);
        }
    });

    router.get('/:uuid', authenticateToken, async (req, res, next) => { // get project by uuid
        try {
            const { uuid } = req.params;
            const project = await knex('projects').select(publicFields).where('uuid', uuid).first();
            if (!project) {
                return res.status(404).json({ error: 'Project not found' });
            }
            res.json(project);
        } catch (err) {
            next(err);
        }
    });

    router.post('/', authenticateToken, async (req, res, next) => { // create new project
        try {
            const { name, description } = req.body;
            const owner_id = req.user.id;
            const rawApiKey = 'myauth_live_' + crypto.randomBytes(32).toString('hex');
            const hashedApiKey = await bcrypt.hash(rawApiKey, saltRounds);

            const [project] = await knex('projects').insert({ name, description, owner_id, api_key: hashedApiKey }).returning(publicFields);
            res.status(201).json({project, api_key: rawApiKey,});
        } catch (err) {
            next(err);
        }
    });

    router.put('/:uuid', authenticateToken, async (req, res, next) => { // update project
        try {
            const { uuid } = req.params;
            const { name, description } = req.body;
            const [project] = await knex('projects').where('uuid', uuid).update({ name, description }).returning(publicFields);
            if (!project) {
                return res.status(404).json({ error: 'Project not found' });
            }
            res.json(project);
        } catch (err) {
            next(err);
        }
    });

    router.delete('/:uuid', authenticateToken, async (req, res, next) => {
        try {
            const { uuid } = req.params;
            const deleted = await knex('projects').where('uuid', uuid).del();
            if (!deleted) {
                return res.status(404).json({ error: 'Project not found' });
            }
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    });

    return router;
};
