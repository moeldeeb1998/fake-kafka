const { Kafka, Partitioners } = require("kafkajs");

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["127.0.0.1:9092"], // Replace with the address of your Kafka broker
});

const consumer = kafka.consumer({ groupId: "group2" });
const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});

async function consumeFromKafka(topic, topicOut) {
  await consumer.connect();
  await producer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`recived message from topic: ${topic}`);
      await producer.send({
        topic: topicOut,
        messages: [
          {
            key: "key",
            value: JSON.stringify({
              data: "Ohhh yeaaa",
            }),
          },
        ],
      });
      console.log(`sent message to ${topicOut}`);
    },
  });
}

// Example usage
consumeFromKafka("transcription", "DiarizationOut");
