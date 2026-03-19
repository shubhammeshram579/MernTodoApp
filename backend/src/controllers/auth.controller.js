import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Cookie Options
const accessTokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 15 * 60 * 1000,
};

const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// Token Generators
const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  });
};

const generateTokensAndSetCookies = async (user, res) => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  // Set both tokens as HttpOnly cookies
  res.cookie("accessToken", accessToken, accessTokenCookieOptions);
  res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

  return { accessToken, refreshToken };
};

// user register
const register = asyncHandler(async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new ApiError(400, "Name, email, and password are required.");
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new ApiError(409, "An account with this email already exists.");
    }

    const user = await User.create({ name, email, password });

    const { accessToken, refreshToken } = await generateTokensAndSetCookies(
      user,
      res,
    );

    return res.status(201).json(
      new ApiResponse(
        201,
        {
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
          },
          accessToken,
          refreshToken,
        },
        "Account created successfully.",
      ),
    );
  } catch (error) {
    throw new ApiError(500, "user register failed" || error.message);
  }
});

// user login
const login = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, "Email and password are required.");
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password",
    );

    if (!user) {
      throw new ApiError(401, "Invalid email or password.");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid email or password.");
    }

    const { accessToken, refreshToken } = await generateTokensAndSetCookies(
      user,
      res,
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
          },
          accessToken,
          refreshToken,
        },
        "Login successful.",
      ),
    );
  } catch (error) {
    throw new ApiError(500, "user login failed" || error.message);
  }
});

// user logout
const logout = asyncHandler(async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      { $unset: { refreshToken: 1 } },
      { new: true },
    );

    res.clearCookie("accessToken", accessTokenCookieOptions);
    res.clearCookie("refreshToken", refreshTokenCookieOptions);

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Logged out successfully."));
  } catch (error) {
    throw new ApiError(500, "user logout failed" || error.message);
  }
});



// refreshAccessToken
const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    const incomingRefreshToken =
      req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingRefreshToken) {
      throw new ApiError(401, "Refresh token missing. Please login again.");
    }

    
    let decoded;

    try {
      decoded = jwt.verify(
        incomingRefreshToken,
        process.env.JWT_REFRESH_SECRET,
      );
    } catch {
      throw new ApiError(
        401,
        "Invalid or expired refresh token. Please login again.",
      );
    }

    const user = await User.findById(decoded.id).select("+refreshToken");

    if (!user) {
      throw new ApiError(401, "User not found. Please login again.");
    }

    if (user.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401, "Refresh token mismatch. Please login again.");
    }

    // Issue a fresh pair of tokens (rotate refresh token for security)
    const { accessToken, refreshToken } = await generateTokensAndSetCookies(
      user,
      res,
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "Access token refreshed successfully.",
        ),
      );
  } catch (error) {
    throw new ApiError(500, "Access refreshed failed" || error.message);
  }
});



// get corrent user
const getMe = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, { user: req.user }, "User profile fetched."));
});

export { register, login, logout, refreshAccessToken, getMe };
