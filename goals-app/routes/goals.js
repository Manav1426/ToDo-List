const express = require("express");
const router = express.Router();
const Goal = require("../models/Goal");
const { goalValidationRules, validate } = require("../middleware/validate");

// GET /api/goals — Get all goals (with optional filter by status or favourite)
router.get("/", async (req, res) => {
  try {
    const query = {};
    if (req.query.status) query.status = req.query.status;
    if (req.query.isFavourite) query.isFavourite = req.query.isFavourite === "true";

    const goals = await Goal.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: goals.length, data: goals });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch goals", message: err.message });
  }
});

// GET /api/goals/:id — Get single goal
router.get("/:id", async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ error: "Goal not found" });
    res.json({ success: true, data: goal });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch goal", message: err.message });
  }
});

// POST /api/goals — Create a new goal
router.post("/", goalValidationRules, validate, async (req, res) => {
  try {
    const { title, description, isFavourite } = req.body;
    const goal = await Goal.create({ title, description, isFavourite });
    res.status(201).json({ success: true, data: goal });
  } catch (err) {
    res.status(500).json({ error: "Failed to create goal", message: err.message });
  }
});

// PUT /api/goals/:id — Update a goal (title, description, isFavourite)
router.put("/:id", goalValidationRules, validate, async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ error: "Goal not found" });

    const { title, description, isFavourite } = req.body;
    if (title !== undefined) goal.title = title;
    if (description !== undefined) goal.description = description;
    if (isFavourite !== undefined) goal.isFavourite = isFavourite;

    await goal.save();
    res.json({ success: true, data: goal });
  } catch (err) {
    res.status(500).json({ error: "Failed to update goal", message: err.message });
  }
});

// PATCH /api/goals/:id/status — Update only the status
router.patch("/:id/status", async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ error: "Goal not found" });

    const { status } = req.body;
    const validStatuses = ["pending", "in-progress", "completed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    // Prevent marking an already-completed goal as complete again
    if (goal.status === "completed" && status === "completed") {
      return res.status(400).json({ error: "Goal is already marked as completed" });
    }

    goal.status = status;
    await goal.save();
    res.json({ success: true, data: goal });
  } catch (err) {
    res.status(500).json({ error: "Failed to update status", message: err.message });
  }
});

// DELETE /api/goals/:id — Delete a goal
router.delete("/:id", async (req, res) => {
  try {
    const goal = await Goal.findByIdAndDelete(req.params.id);
    if (!goal) return res.status(404).json({ error: "Goal not found" });
    res.json({ success: true, message: "Goal deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete goal", message: err.message });
  }
});

module.exports = router;
