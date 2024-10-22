import fs from "fs";

// Task function to log task completion
const task = async (userId) => {
  const log = `${userId} - task completed at - ${new Date().toISOString()}\n`;
  fs.appendFileSync("D:/intershala tasks/finTarget task/logs/taskLogs.txt", log);
  console.log(log);
};

// Task queue for managing requests
const taskQueue = {};

// Controller function to queue a task
const queueTask = (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).send("User ID is required.");
  }

  // Initialize queue for the user if not exists
  if (!taskQueue[userId]) {
    taskQueue[userId] = [];
  }

  // Add task to queue
  taskQueue[userId].push(() =>
    task(userId).then(() => {
      // Remove completed task from queue
      taskQueue[userId].shift();
      if (taskQueue[userId].length > 0) {
        // Process the next task
        taskQueue[userId][0]();
      }
    })
  );

  // Start processing if it's the only task in the queue
  if (taskQueue[userId].length === 1) {
    taskQueue[userId][0](); // Start processing
  }

  res.status(202).send("Task queued");
};

export { queueTask };
