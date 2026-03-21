import WeeklyPlan from '../../schema/Users/weeklyPlanSchema.js';

// ── Helper: normalize any date → Monday 00:00:00 of that week ────────────────
const toMonday = (dateInput) => {
  const d = new Date(dateInput);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // 0 = Sun, 1 = Mon … 6 = Sat
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
  return d;
};

// ── Helper: build 7 empty day objects from a Monday ──────────────────────────
const buildEmptyDays = (monday) =>
  Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return { date: d, breakfast: null, lunch: null, dinner: null, snack: null };
  });

// ─────────────────────────────────────────────────────────────────────────────
// @desc  Get the weekly plan for a given start date
// @route GET /api/users/weekly-plan?startDate=YYYY-MM-DD
// @access Private
// ─────────────────────────────────────────────────────────────────────────────
export const getWeeklyPlan = async (req, res) => {
  try {
    const { startDate } = req.query;

    if (!startDate) {
      return res.status(400).json({ message: 'startDate query param is required' });
    }

    const monday = toMonday(new Date(startDate));
    const plan   = await WeeklyPlan.findOne({ user: req.user.id, startDate: monday });

    if (!plan) {
      // Return an empty scaffold — frontend treats this as a blank week
      return res.status(200).json({
        startDate: monday,
        days:      buildEmptyDays(monday),
      });
    }

    res.status(200).json(plan);
  } catch (error) {
    console.error('getWeeklyPlan error:', error);
    res.status(500).json({ message: 'Server error fetching weekly plan' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc  Save (create or update) the weekly plan
// @route POST /api/users/weekly-plan
// @access Private
// Body: { startDate: 'YYYY-MM-DD', days: [...7 day objects] }
// ─────────────────────────────────────────────────────────────────────────────
export const saveWeeklyPlan = async (req, res) => {
  try {
    const { startDate, days } = req.body;

    if (!startDate || !Array.isArray(days) || days.length !== 7) {
      return res.status(400).json({
        message: 'startDate and an array of exactly 7 days are required',
      });
    }

    const monday = toMonday(new Date(startDate));

    const plan = await WeeklyPlan.findOneAndUpdate(
      { user: req.user.id, startDate: monday },
      { user: req.user.id, startDate: monday, days },
      { upsert: true, new: true, runValidators: true }
    );

    res.status(200).json(plan);
  } catch (error) {
    console.error('saveWeeklyPlan error:', error);
    res.status(500).json({ message: 'Server error saving weekly plan' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc  Clear all meals for one specific day in the plan
// @route PATCH /api/users/weekly-plan/clear-day
// @access Private
// Body: { startDate: 'YYYY-MM-DD', dayIndex: 0–6 }
// ─────────────────────────────────────────────────────────────────────────────
export const clearDay = async (req, res) => {
  try {
    const { startDate, dayIndex } = req.body;

    if (!startDate || dayIndex === undefined) {
      return res.status(400).json({ message: 'startDate and dayIndex are required' });
    }

    const monday = toMonday(new Date(startDate));
    const plan   = await WeeklyPlan.findOne({ user: req.user.id, startDate: monday });

    if (!plan) {
      return res.status(404).json({ message: 'Plan not found for this week' });
    }

    // Null out all 4 slots for the specified day
    plan.days[dayIndex].breakfast = null;
    plan.days[dayIndex].lunch     = null;
    plan.days[dayIndex].dinner    = null;
    plan.days[dayIndex].snack     = null;
    plan.markModified('days');
    await plan.save();

    res.status(200).json(plan);
  } catch (error) {
    console.error('clearDay error:', error);
    res.status(500).json({ message: 'Server error clearing day' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc  Delete the entire weekly plan for a given week
// @route DELETE /api/users/weekly-plan?startDate=YYYY-MM-DD
// @access Private
// ─────────────────────────────────────────────────────────────────────────────
export const deleteWeeklyPlan = async (req, res) => {
  try {
    const { startDate } = req.query;

    if (!startDate) {
      return res.status(400).json({ message: 'startDate query param is required' });
    }

    const monday = toMonday(new Date(startDate));
    await WeeklyPlan.findOneAndDelete({ user: req.user.id, startDate: monday });

    res.status(200).json({ message: 'Weekly plan deleted successfully' });
  } catch (error) {
    console.error('deleteWeeklyPlan error:', error);
    res.status(500).json({ message: 'Server error deleting weekly plan' });
  }
};