// import express from "express";
// import { limiter, perSecondLimiter } from "./middleware/ratelimiter.js";
// import dotenv from "dotenv";
// import taskRoutes from "./routes/taskRoute.js";

// const app = express();
// dotenv.config();
// app.use(express.json());

// app.use("/", limiter, perSecondLimiter);
// app.use("/api/v1", taskRoutes);

// app.listen(process.env.PORT, () => {
//   console.log(`application is running on port ${process.env.PORT}`);
// });

import cluster from "cluster";
import express from "express";
import { limiter, perSecondLimiter } from "./middleware/ratelimiter.js";
import dotenv from "dotenv";
import taskRoutes from "./routes/taskRoute.js";
import os from "os";

const numCPUs = 2; // Set the number of replicas based on CPU cores

dotenv.config();

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork worker processes
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // Apply rate limiting middleware to the task route
  app.use("/api/v1/task", limiter, perSecondLimiter);
  app.use("/api/v1", taskRoutes); // Use your task routes

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong!");
  });

  // Start the server
  app.listen(PORT, () => {
    console.log(`Worker ${process.pid} started and listening on port ${PORT}`);
  });
}
