import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { successResponse, errorResponse } from "../utils/response.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return errorResponse(res, "User already exists", 400);
    }

   

    const user = await User.create({
      name,
      email,
      password 
    });

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email
    };

    return successResponse(res, userData, "User registered successfully");

  } catch (err) {
    next(err);
  }
};


export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

const user = await User.findOne({ email }).select("+password");    if (!user) {
      return errorResponse(res, "Invalid email", 400);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return errorResponse(res, "Invalid password", 400);
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return successResponse(
      res,
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      },
      "Login successful"
    );

  } catch (err) {
    next(err);
  }
};