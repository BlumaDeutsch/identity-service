const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const authenticateToken = require("../middleware/auth");


module.exports = (knex) => {
    const router = express.Router();
    const publicFields = ['id', 'username', 'email'];

    router.post('/login', async (req, res) => {

        const { email, password } = req.body;

        try {
            const user = await knex('users').where({ email }).first();
            if (!user) {
                return res.status(401).json({ error: "Invalid email or password" });
            }

            const isMatch = await bcrypt.compare(password, user.password_hash);
            if (!isMatch) {
                return res.status(401).json({ error: "Invalid email or password" });
            }

            const token = jwt.sign(
                { id: user.id, email: user.email },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            const { password_hash, ...userPublicData } = user;
            res.json({
                message: "Login successful",
                token,
                user: userPublicData
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Server error during login" });
        }
    });

    // user routes 
    router.get('/', authenticateToken, async (req, res) => { // get all users
        try {
            const users = await knex('users').select(publicFields);
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    router.get('/:id', authenticateToken, async (req, res) => { // get user by id
        try {
            const userId = req.params.id;
            const user = await knex('users').select(publicFields).where({ id: userId }).first();
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    router.post('/', async (req, res) => { // create new user 
        try {
            const { username, email, password } = req.body;
            const password_hash = await bcrypt.hash(password, saltRounds);
            const newUser = await knex('users').insert({ username, email, password_hash }).returning(publicFields);
            res.status(201).json(newUser[0]);
        } catch (error) {
            console.log("error in create user: ", error);
            res.status(500).json({ error: error.message });
        }
    });

    router.patch('/:id', authenticateToken, async (req, res) => { // update user
        try {
            const userId = req.params.id;
            const { username, email } = req.body;
            const [updatedUser] = await knex('users').where({ id: userId }).update({ username, email }).returning(publicFields);

            res.json({ message: `User ${userId} updated successfully!`, user: updatedUser });
        } catch (error) {
            console.log("error: ", error);
            res.status(500).json({ error: error.message });
        }
    });

    router.patch('/:id/password', authenticateToken, async (req, res) => { // update user password
        try {
            const userId = req.params.id;
            const { currentPassword, newPassword } = req.body;

            const user = await knex('users').where({ id: userId }).first();
            const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
            if (!isMatch)
                return res.status(401).json({ error: "Current password incorrect" });
            const password_hash = await bcrypt.hash(newPassword, saltRounds);
            await knex('users').where({ id: userId }).update({ password_hash: password_hash });

            res.json({ message: `Password for user ${userId} updated successfully!` });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    router.delete('/:id', authenticateToken, async (req, res) => { // delete user
        try {
            const userId = req.params.id;
            await knex('users').where({ id: userId }).del();
            res.json({ message: `User ${userId} deleted successfully!` });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    return router;
};
