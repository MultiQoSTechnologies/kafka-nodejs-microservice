// productKafkaConsumer.js
const Kafka = require('kafka-node');

// Define Kafka consumer client
const client = new Kafka.KafkaClient();
const Consumer = Kafka.Consumer;

function consumeProductMessages(topicNames, consumerGroupId) {
    const topicsToSubscribe = topicNames.map(topic => ({ topic: topic, partition: 0 }));
    console.log(`Initializing product consumer for topics: ${topicNames.join(', ')}`);

    const consumer = new Consumer(
        client,
        topicsToSubscribe,
        {
            autoCommit: false,
            groupId: consumerGroupId
        }
    );

    // Handle incoming product messages
    consumer.on('message', function (message) {
        handleProductMessage(message);
    });

    // Handle consumer errors
    consumer.on('error', function (err) {
        console.error(`Error occurred while consuming product messages: ${err.message}`);
        // Implement retry or other error handling mechanisms if needed
    });

    // Handle consumer offsets errors
    consumer.on('offsetOutOfRange', function (topic) {
        console.error(`Offset out of range error for product topic ${topic}`);
        // Implement error handling logic here
    });

    return consumer;
}

const handleProductMessage = (message) => {
    const { topic, value } = message;

    if (value) {
        try {
            const parsedValue = JSON.parse(value);
            switch (topic) {
                case 'ProductCreated':
                    console.log(`Product created: ${parsedValue.name}`);
                    break;
                case 'ProductUpdated':
                    console.log(`Product updated: ${parsedValue.name}`);
                    break;
                case 'ProductDeleted':
                    console.log(`Product deleted: ${parsedValue.name}`);
                    break;
                default:
                    console.log(`Unknown product topic: ${topic}`);
            }
        } catch (err) {
            console.error(`Error processing product message: ${err.message}`);
            // Implement error handling logic here
        }
    }
};

module.exports = { consumeProductMessages };
