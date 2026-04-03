import express from "express";
import {
  createTask,
  getTasks,
  completeTask,
  updateTask,
  deleteTask
} from "../controllers/taskController.js";

import {
  dailyStats,
  weeklyStats,
  productivity
} from "../controllers/analyticsController.js";

import { authMiddleware } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { createTaskSchema } from "../validators/taskValidator.js";

const router = express.Router();
// Swagger used for testing purpose on api/docs for my comfort

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task Management & Analytics APIs
 */


/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Complete assignment
 *               description:
 *                 type: string
 *                 example: Finish Node.js project
 *               timeSpent:
 *                 type: number
 *                 example: 60
 *     responses:
 *       200:
 *         description: Task created successfully
 */
router.post("/", authMiddleware, validate(createTaskSchema), createTask);


/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks with pagination
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         example: 10
 *     responses:
 *       200:
 *         description: List of tasks
 */
router.get("/", authMiddleware, getTasks);


/**
 * @swagger
 * /api/tasks/{id}/complete:
 *   put:
 *     summary: Mark task as completed
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 64f123abc456
 *     responses:
 *       200:
 *         description: Task marked as completed
 *       404:
 *         description: Task not found
 */
router.put("/:id/complete", authMiddleware, completeTask);


/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update an existing task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 64f123abc456
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated Task Title
 *               description:
 *                 type: string
 *                 example: Updated description
 *               timeSpent:
 *                 type: number
 *                 example: 90
 *               status:
 *                 type: string
 *                 enum: [pending, completed]
 *                 example: completed
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       400:
 *         description: Invalid task ID
 *       404:
 *         description: Task not found
 */
router.put("/:id", authMiddleware, updateTask);


/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 64f123abc456
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       400:
 *         description: Invalid task ID
 *       404:
 *         description: Task not found
 */
router.delete("/:id", authMiddleware, deleteTask);

/**
 * @swagger
 * /api/tasks/stats/daily:
 *   get:
 *     summary: Get daily task analytics
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daily stats
 */
router.get("/stats/daily", authMiddleware, dailyStats);


/**
 * @swagger
 * /api/tasks/stats/weekly:
 *   get:
 *     summary: Get weekly task analytics
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Weekly stats
 */
router.get("/stats/weekly", authMiddleware, weeklyStats);


/**
 * @swagger
 * /api/tasks/stats/productivity:
 *   get:
 *     summary: Get productivity score
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Productivity score
 */
router.get("/stats/productivity", authMiddleware, productivity);


export default router;