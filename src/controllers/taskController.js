import Task from "../models/Task.js";
import mongoose from "mongoose";
import { successResponse, errorResponse } from "../utils/response.js";

export const createTask = async (req, res, next) => {
  try {
    const task = await Task.create({
      ...req.body,
      userId: req.user.id
    });

    return successResponse(res, task, "Task created successfully");
  } catch (err) {
    next(err);
  }
};

export const getTasks = async (req, res, next) => {
  try {
    let { page = 1, limit = 10 } = req.query;

    page = Number(page);
    limit = Number(limit);

    const query = { userId: req.user.id };

    const tasks = await Task.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Task.countDocuments(query);

    return successResponse(
      res,
      {
        tasks,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      },
      "Tasks fetched successfully"
    );
  } catch (err) {
    next(err);
  }
};



export const completeTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, "Invalid task ID", 400);
    }

    const task = await Task.findOne({
      _id: id,
      userId: req.user.id
    });

    if (!task) {
      return errorResponse(res, "Task not found", 404);
    }

    task.status = "completed";
    task.completedAt = new Date();

    await task.save();

    return successResponse(res, task, "Task marked as completed");

  } catch (err) {
    next(err);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    // check valid ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, "Invalid task ID", 400);
    }

    // find task
    const task = await Task.findOne({
      _id: id,
      userId: req.user.id
    });

    if (!task) {
      return errorResponse(res, "Task not found", 404);
    }

    // update fields
    const { title, description, timeSpent, status } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (timeSpent !== undefined) task.timeSpent = timeSpent;

    // optional status update
    if (status === "completed") {
      task.status = "completed";
      task.completedAt = new Date();
    }

    await task.save();

    return successResponse(res, task, "Task updated successfully");

  } catch (err) {
    next(err);
  }
};


export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, "Invalid task ID", 400);
    }

    const task = await Task.findOneAndDelete({
      _id: id,
      userId: req.user.id
    });

    if (!task) {
      return errorResponse(res, "Task not found", 404);
    }

    return successResponse(res, null, "Task deleted successfully");

  } catch (err) {
    next(err);
  }
};