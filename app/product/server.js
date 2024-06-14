const express = require('express');
const bodyParser = require('body-parser');
const productRoutes = require('./produceRoute');
const { consumeProductMessages } = require('./kafkaConsumer');

const app = express();
const PORT = 3001;

app.use(bodyParser.json());

app.get('/api', async (req, res) => {
    const message = "Hello,Product service are running"
    res.status(200).json(message);
});

// Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/product-service', { useNewUrlParser: true, useUnifiedTopology: true });

// Register routes
app.use('/api/product', productRoutes);

const consumerGroupId = 'my-group-id';
const topics = ['ProductCreated',/*'ProductDataList', 'ProductView', 'ProductUpdated'*/];
consumeProductMessages(topics, consumerGroupId);
// Start server
app.listen(PORT, () => {
    console.log(`Product Server is running on http://localhost:${PORT}`);
});