import {
  getDailyStatsService,
  getWeeklyStatsService,
  getProductivityScoreService
} from "../services/analyticsService.js";

import { successResponse } from "../utils/response.js";

export const dailyStats = async (req, res, next) => {
  try {
    const data = await getDailyStatsService(req.user.id);

    return successResponse(
      res,
      data || [],
      "Daily stats fetched successfully"
    );
  } catch (err) {
    next(err);
  }
};


export const weeklyStats = async (req, res, next) => {
  try {
    const data = await getWeeklyStatsService(req.user.id);

    return successResponse(
      res,
      data || [],
      "Weekly stats fetched successfully"
    );
  } catch (err) {
    next(err);
  }
};


export const productivity = async (req, res, next) => {
  try {
    const data = await getProductivityScoreService(req.user.id);

    return successResponse(
      res,
      data,
      "Productivity score calculated successfully"
    );
  } catch (err) {
    next(err);
  }
};