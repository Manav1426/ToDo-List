const { body, validationResult } = require("express-validator");

// Validation rules for creating/updating a goal
const goalValidationRules = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ max: 200 })
    .withMessage("Title cannot exceed 200 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters"),
  body("status")
    .optional()
    .isIn(["pending", "in-progress", "completed"])
    .withMessage("Status must be pending, in-progress, or completed"),
  body("isFavourite")
    .optional()
    .isBoolean()
    .withMessage("isFavourite must be a boolean"),
];

// Middleware to check validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Validation failed",
      messages: errors.array().map((e) => e.msg),
    });
  }
  next();
};

module.exports = { goalValidationRules, validate };
