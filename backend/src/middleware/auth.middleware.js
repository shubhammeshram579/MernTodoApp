import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Protect routes — verifies the accessToken.
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Cookie — browser clients
  if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }
  // 2. Authorization header — API / mobile clients
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new ApiError(401, "Access denied. No access token provided.");
  }

  // Verify token against JWT_SECRET (not the refresh secret)
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError(
        401,
        "Access token expired. Please refresh your session.",
      );
    }
    throw new ApiError(401, "Invalid access token. Authorization denied.");
  }

  // Attach the authenticated user to request (password and refreshToken excluded)
  const user = await User.findById(decoded.id).select(
    "-password -refreshToken",
  );
  if (!user) {
    throw new ApiError(
      401,
      "User associated with this token no longer exists.",
    );
  }

  req.user = user;
  next();
});

export { protect };
