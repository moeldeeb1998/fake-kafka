const { Kafka, Partitioners } = require("kafkajs");

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["127.0.0.1:9092"], // Replace with the address of your Kafka broker
});

const consumer = kafka.consumer({ groupId: "group1" });
const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});

async function consumeFromKafka(topic, topicOut) {
  await consumer.connect();
  await producer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      let id = 0;
      try {
        id = JSON.parse(message.value)?.id;
      } catch (err) {
        console.log(err.message);
      }
      console.log(`recivied message (${id}) from topic: ${topic}`);

      // console.log({
      //   value: message?.value?.toString(),
      //   topic: topic,
      // });

      await producer.send({
        topic: topicOut,
        messages: [
          {
            key: "key",
            value: JSON.stringify({
              id,
              data: `id: ${id}`,
            }),
          },
        ],
      });
      console.log(`send message to topic ${topicOut}`);
    },
  });
}

// Example usage
consumeFromKafka("Youssef", "RealTimeOut");
