const { Router } = require("express");
const jwt = require('jsonwebtoken');
const db = require("../config");
const router = Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const authenticateToken = require("../middleware/auth");

router.get('/', (req, res) => {
    res.send('Hello from the API!');
});

router.post('/login', async (req, res) => {

    const { email, password } = req.body;
    console.log("login: ", email, password);

    try {
        const user = await db('users').where({ email }).first();
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
router.get('/users', authenticateToken, async (req, res) => { // get all users
    try {
        const users = await db('users').select({ id, username, email });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/users/:id', authenticateToken, async (req, res) => { // get user by id
    try {
        const userId = req.params.id;
        const user = await db('users').select({ id, username, email }).where({ id: userId }).first();
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/users', async (req, res) => { // create new user 
    try {
        const { username, email, password } = req.body;
        const password_hash = await bcrypt.hash(password, saltRounds);
        const [newUserId] = await db('users').insert({ username, email, password_hash }).returning('id');
        res.status(201).json({ id: newUserId, username, email });
    } catch (error) {
        console.log("error in create user: ", error);
        res.status(500).json({ error: error.message });
    }
});

router.patch('/users/:id', authenticateToken, async (req, res) => { // update user
    try {
        const userId = req.params.id;
        const { username, email } = req.body;
        const [updatedUser] = await db('users').where({ id: userId }).update({ username, email }).returning(['id', 'username', 'email']);

        res.json({ message: `User ${userId} updated successfully!`, user: updatedUser });
    } catch (error) {
        console.log("error: ", error);
        res.status(500).json({ error: error.message });
    }
});

router.patch('/users/:id/password', authenticateToken, async (req, res) => { // update user password
    try {
        const userId = req.params.id;
        const { currentPassword, newPassword } = req.body;

        const user = await db('users').where({ id: userId }).first();
        const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isMatch)
            return res.status(401).json({ error: "Current password incorrect" });
        const password_hash = await bcrypt.hash(newPassword, saltRounds);
        await db('users').where({ id: userId }).update({ password_hash: password_hash });

        res.json({ message: `Password for user ${userId} updated successfully!` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/users/:id', authenticateToken, async (req, res) => { // delete user
    try {
        const userId = req.params.id;
        await db('users').where({ id: userId }).del();
        res.json({ message: `User ${userId} deleted successfully!` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;