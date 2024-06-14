const express = require('express');
// const consumeMessages = require('./kafkaConsumer');
const sendMessage = require('./kafkaProducer');
const router = express.Router();
// routes/userRoutes.js
const userController = require('./userController');
const { loginUser, viewUser } = require('./userController');

// router.post('/', async (req, res) => {
//     const { topic, message } = req.body;
//     try {
//         const result = await sendMessage(topic, message);
//         res.status(200).json({ success: true, data: result });
//     } catch (error) {
//         console.error('Error sending message:', error);
//         res.status(500).json({ success: false, error: error.message });
//     }
// });

// Create a new user (POST /users/login)
router.post('/login', userController.loginUser);

// Add a new user (POST /users/add)
router.post('/add', userController.createUser);

// Get all users (GET /users)
router.get('/', userController.getAllUsers);

// Get a single user by ID (GET /users/:id)
router.get('/:id', userController.getUserById);

// Update a user by ID (PUT /users/:id)
router.put('/:id', userController.updateUserById);

// Delete a user by ID (DELETE /users/:id)
router.delete('/:id', userController.deleteUserById);

module.exports = router;
