const Kafka = require('kafka-node');

// Define Kafka producer client
const client = new Kafka.KafkaClient();
const Producer = Kafka.Producer;
const producer = new Producer(client);

// Wait for the producer to be ready
producer.on('ready', function () {
    console.log('Kafka Producer is connected and ready for |:Product:|');
});

producer.on('error', function (err) {
    console.error('Error occurred in Kafka producer:', err);
});

function produceProductMessage(productTopic, productMessage) {
    console.log("Producing message for product topic:", productTopic);
    return new Promise((resolve, reject) => {
        const payloads = [
            {
                topic: productTopic,
                messages: JSON.stringify(productMessage),
                partition: 0
            }
        ];

        producer.send(payloads, (err, data) => {
            if (err) {
                console.error('Error sending message to Kafka:', err);
                return reject(err);
            }
            console.log('Message sent to Kafka:', data);
            resolve(data);
        });
    });
}

module.exports = produceProductMessage;
