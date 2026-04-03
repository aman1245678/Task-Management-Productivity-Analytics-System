import Task from "../models/Task.js";
import mongoose from "mongoose";


export const getDailyStatsService = async (userId) => {
  const stats = await Task.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId)
      }
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" }
        },
        totalTasks: { $sum: 1 },
        completedTasks: {
          $sum: {
            $cond: [{ $eq: ["$status", "completed"] }, 1, 0]
          }
        },
        totalTime: { $sum: "$timeSpent" }
      }
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
        "_id.day": 1
      }
    }
  ]);

  return stats;
};



export const getWeeklyStatsService = async (userId) => {
  const stats = await Task.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId)
      }
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          week: { $week: "$createdAt" }
        },
        totalTasks: { $sum: 1 },
        completedTasks: {
          $sum: {
            $cond: [{ $eq: ["$status", "completed"] }, 1, 0]
          }
        },
        totalTime: { $sum: "$timeSpent" }
      }
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.week": 1
      }
    }
  ]);

  return stats;
};



export const getProductivityScoreService = async (userId) => {
  const result = await Task.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId)
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        completed: {
          $sum: {
            $cond: [{ $eq: ["$status", "completed"] }, 1, 0]
          }
        },
        avgTime: { $avg: "$timeSpent" }
      }
    }
  ]);

  const data = result[0] || {
    total: 0,
    completed: 0,
    avgTime: 0
  };

  const completionRate = data.total
    ? (data.completed / data.total) * 100
    : 0;

  const avgTime = data.avgTime || 0;

  const productivityScore =
    (completionRate * 0.7) + ((100 - avgTime) * 0.3);

  return {
    totalTasks: data.total,
    completedTasks: data.completed,
    completionRate: Number(completionRate.toFixed(2)),
    avgTime: Number(avgTime.toFixed(2)),
    productivityScore: Number(productivityScore.toFixed(2))
  };
};