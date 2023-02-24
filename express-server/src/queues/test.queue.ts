import { Queue } from "bullmq";

export const testQueue = new Queue("test", {
  connection: {
    host: "http://localhost",
    port: 6379,
    username: "",
    password: "qwerty123!@#",
  },
});
