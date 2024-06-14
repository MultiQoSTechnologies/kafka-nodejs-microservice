const Kafka = require('kafka-node');

// Define Kafka consumer client
const client = new Kafka.KafkaClient();
const Consumer = Kafka.Consumer;

function consumeMessages(topicNames, consumerGroupId) {
    const topicsToSubscribe = topicNames.map(topic => ({ topic: topic, partition: 0 }));
    console.log(`Initializing consumer for topics :=> * ${topicNames.join(' * ')} *`);

    // const topicsToSubscribe = [{ topic: topicNames, partition: 0 }];
    // console.log(`Initializing consumer for topic: ${topicNames}`);
    const consumer = new Consumer(
        client,
        topicsToSubscribe,
        {
            autoCommit: false,
            groupId: consumerGroupId // Use the provided consumer group ID
        }
    );

    // Handle incoming messages
    consumer.on('message', function (message) {
        handleMessage(message); // Pass the 'message' object to the 'handleMessage' function
    });

    // Handle consumer errors
    consumer.on('error', function (err) {
        console.error(`Error occurred while consuming messages:`, err);
    });

    // Handle consumer offsets errors
    consumer.on('offsetOutOfRange', function (topic) {
        console.error(`Offset out of range error for topic ${topic}`);
    });

    return consumer;
}

const handleMessage = (message) => {
    const { topic, value } = message;

    if (value) {
        const parsedValue = JSON.parse(value);
        switch (topic) {
            case 'UserLoggedIn':
                console.log(`User logged in: ${parsedValue.username}`);
                break;
            case 'UserCreated':
                console.log(`User created: ${parsedValue.username}`);
                break;
            case 'UserDataList':
                console.log(`User data list requested`);
                break;
            case 'UserViewProfile':
                console.log(`User profile viewed: ${parsedValue.username}`);
                break;
            case 'UserProfileUpdate':
                console.log(`User profile updated: ${parsedValue.username}`);
                break;
            case 'UserDeleted':
                console.log(`User deleted: ${parsedValue.username}`);
                break;
            default:
                console.log(`Unknown topic: ${topic}`);
        }
    }
};

module.exports = { consumeMessages };
