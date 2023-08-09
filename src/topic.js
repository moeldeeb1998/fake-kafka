//const Kafka = require("kafkajs").Kafka
const { Kafka } = require("kafkajs");

run();
async function run() {
  try {
    const kafka = new Kafka({
      clientId: "my-app",
      brokers: ["127.0.0.1:9092"],
    });

    const admin = kafka.admin();
    console.log("Connecting.....");
    await admin.connect();
    console.log("Connected!");
    //A-M, N-Z
    await admin.createTopics({
      topics: [
        {
          topic: "Youssef",
          numPartitions: 2,
        },
        {
          topic: "RealTimeOut",
          numPartitions: 2,
        },
        {
          topic: "transcription",
          numPartitions: 2,
        },
        {
          topic: "DiarizationOut",
          numPartitions: 2,
        },
      ],
    });
    console.log("Created Successfully!");
    await admin.disconnect();
  } catch (ex) {
    console.error(`Something bad happened ${ex}`);
  } finally {
    process.exit(0);
  }
}
