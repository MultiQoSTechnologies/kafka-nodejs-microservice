// index.js (User Microservice)
const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./userRoutes');
const { consumeMessages } = require('./kafkaConsumer');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.get('/api', async (req, res) => {
    const message = "Hello,User service are running"

    res.status(200).json(message);
});
// Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/user-service', { useNewUrlParser: true, useUnifiedTopology: true });

// Register routes
app.use('/api/users', userRoutes);

// Kafka consumer setup
const consumerGroupId = 'my-group-id';
const topics = ['UserLoggedIn',/*'UserDataList', 'UserViewProfile', 'UserProfileUpdate'*/];
consumeMessages(topics, consumerGroupId);

// Start server
app.listen(PORT, () => {
    console.log(`User service is running on http://localhost:${PORT}`);
});
