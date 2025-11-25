import { body } from "express-validator";

export const registerValidator = [
  body("email").isEmail().withMessage("Invalid email"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 chars")
];

export const loginValidator = [
  body("email").isEmail().withMessage("Invalid email"),
  body("password").exists().withMessage("Password required")
];
