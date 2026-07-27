const Task = require('../models/Task');
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

// ----------Create task-------------------------
exports.createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      amount,
      taskDate,
      workspace,
    } = req.body;
    console.log("REQ BODY:", req.body);
    const attachments = [];

    if (req.files) {
      req.files.forEach((file) => {
        attachments.push({
          fileName: file.originalname,
          filePath: file.filename,
          fileType: file.mimetype,
        });
      });
    }

    const task = await Task.create({
      user: req.user.id,
      title,
      description,
      category,
      amount,
      taskDate,
      workspace,
      attachments,
    });

    res.status(201).json(task);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};
// ---------Import task------------

exports.importTask = async (req, res) => {
  try {
    console.log("import task triggered")
    const tasks = [];


    if (!req.file) {
  return res.status(400).json({
    message: "Please upload a CSV file.",
  });
}
console.log(req.file);

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (row) => {
        tasks.push({
          title: row.title,
          description: row.description,
          amount: Number(row.amount),
          status: row.status || "pending",
          priority: row.priority || "medium",
          taskDate: row.taskDate,
          user: req.user.id, // important
        });
      })
      .on("end", async () => {
        try {
          console.log(tasks);
console.log("Total tasks:", tasks.length);
          await Task.insertMany(tasks);

          fs.unlinkSync(req.file.path);

          res.status(201).json({
            success: true,
            message: `${tasks.length} tasks imported successfully`,
          });
        } catch (err) {
          res.status(500).json({
            message: err.message,
          });
        }
      });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
   
  }
};

// ----------Restore task------------------------
exports.restoreTask = async (req, res) => {
  try {

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        isDeleted: false,
        deletedAt: null
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Task restored",
      task
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
// ----------Get Personal task--------------------
exports.getPersonalTasks = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = {
      user: req.user.id,
      workspace: null,
      isDeleted: false,
    };

    if (
      status &&
      status !== "all"
    ) {
      filter.status = status;
    }

    const tasks = await Task.find(filter)
      .populate("category","name ")

    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// ----------add attachment--------------
exports.addAttachments = async (
  req,
  res
) => {
  try {
    const task = await Task.findById(
      req.params.id
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const newFiles = req.files.map(
      (file) => ({
        fileName: file.originalname,
        filePath: file.filename,
        fileType: file.mimetype,
      })
    );

    task.attachments.push(...newFiles);

    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
// -----delete an attachment------------
exports.deleteAttachment = async (req, res) => {
  try {
    const { taskId, attachmentId } = req.params;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const attachment = task.attachments.id(
      attachmentId
    );

    if (!attachment) {
      return res.status(404).json({
        success: false,
        message: "Attachment not found",
      });
    }

    // delete physical file
    const filePath = path.join(
      __dirname,
      "../uploads",
      attachment.filePath
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // remove from task
    task.attachments.pull(attachmentId);

    await task.save();

    res.status(200).json({
      success: true,
      message: "Attachment deleted",
      attachments: task.attachments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//----------- Get workspace tasks---------------------------
exports.getWorkspaceTasks = async (req, res) => {

  try {

    const tasks = await Task.find({
      workspace: req.params.workspaceId,
      isDeleted: false,
    })
      .populate("user", "name");

    res.json(tasks);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};
// -----upload images or pdf to each task -----------
exports.uploadAttachment = async (req, res) => {
  try {
    console.log("REQ FILES:", req.files);
    console.log("TASK ID:", req.params.id);
    console.log("ADD ATTACHMENT ROUTE HIT");
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    req.files.forEach((file) => {
      task.attachments.push({
        fileName: file.originalname,
        filePath: file.filename,
        fileType: file.mimetype,
      });
    });

    await task.save();

    res.json(task);
  } catch (error) {
    console.log("ATTACHMENT ERROR:");
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};
// ------------Update task-----------------------
exports.updateTask= async (req,res)=>{
try {
  const task= await Task.findById(req.params.id);
  if(!task){
    return res.status(404).json({message:"Task not found"});
  }
  const isCreator =
    task.user?.toString() === req.user._id.toString();  
    
  const isAssignedUser =
    task.assignedTo?.toString() === req.user._id.toString(); 

   if (!isCreator && !isAssignedUser) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }
    console.log("REQ BODY:", req.body);

    task.title=req.body.title??task.title;
    task.description=req.body.description??task.description;
    task.amount=req.body.amount??task.amount;
    task.category=req.body.category??task.category;
    task.taskDate=req.body.taskDate??task.taskDate;
    task.priority=req.body.priority??task.priority;
  
  await task.save();
  const updateTask= await Task.findById(req.params.id)
  .populate("category","name");
  console.log("UPDATED TASK:", task);
  res.json(updateTask);
}
  catch (error){
    console.error("UPDATE TASK ERROR:");
    console.error(error); 
    res.status(500).json({
      message: error.message,
    })  
}
}
// -----------Update status-------------------------
// exports.updateTaskStatus = async (req, res) => {
//   try {

//     const task = await Task.findById(req.params.id);

//     if (!task) {
//       return res.status(404).json({ message: 'Task not found' });
//     }
//     console.log("req.user:", req.user);
//     const isCreator =
//       task.user?.toString() === req.user._id.toString();

//     const isAssignedUser =
//       task.assignedTo?.toString() === req.user._id.toString();

//     if (!isCreator && !isAssignedUser) {
//       return res.status(403).json({
//         message: "Not authorized",
//       });
//     }

//     // 🔥 Toggle here
//     if (task.status === "pending") {
//       task.status = "completed"
//       task.completedAt = new Date();
//     }
//     else {
//       task.status = "pending";
//       task.completedAt = null;
//     }

//     await task.save();

//     res.json(task);
//   } catch (error) {
//     console.error("UPDATE TASK ERROR:");
//     console.error(error);

//     res.status(500).json({
//       message: error.message,
//       stack: error.stack,
//     });
//   }
// };
exports.updateTaskStatus = async (
  req,
  res
) => {
  try {
    const { status } = req.body;

    const task =
      await Task.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );

    res.json(task);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
//-------------Delete-------------------------------
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        isDeleted: true,
        deletedAt: new Date()
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Task moved to trash",
      task
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
// -----------Permanantly  Delete Task-------------
exports.permanentDeleteTask = async (req, res) => {
  try {

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Task permanently deleted"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
// ----------- getMonthlyCategorySummary-------------------

exports.getMonthlyCategorySummary = async (req, res) => {
  const { month, year } = req.query;
  const userId = req.user.id;

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);

  try {
    const data = await Expense.aggregate([
      {
        $match: {
          user: userId,
          createdAt: { $gte: start, $lt: end },
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
    ]);

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};