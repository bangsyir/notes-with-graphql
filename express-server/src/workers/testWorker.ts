import { Job, Worker } from "bullmq";

const worker = new Worker("test", async (job: Job) => {
  console.log(job);
});

worker.on("completed", (job) => {
  console.log(`${job.id} has completed!`);
});

worker.on("failed", (job, err) => {
  console.log(`${job?.id} has failed with ${err.message}`);
});
