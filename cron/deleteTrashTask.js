const cron = require("node-cron");
const Task = require("../models/Task");

cron.schedule("0 0 * * *", async () => {

  const thirtyDaysAgo = new Date(
    Date.now() - 30 * 24 * 60 * 60 * 1000
  );

  await Task.deleteMany({
    isDeleted: true,
    deletedAt: { $lte: thirtyDaysAgo }
  });

  console.log("Old trash tasks deleted");

});