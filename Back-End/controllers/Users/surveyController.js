import Survey from '../../schema/Users/surveySchema.js';

export const submitSurvey = async (req, res) => {
  try {
    const { option, feedback } = req.body;
    const userId = req.user?._id;

    if (!option) {
      return res.status(400).json({ 
        success: false, 
        result: { message: 'Please select an option' } 
      });
    }

    const survey = new Survey({
      user: userId,
      option,
      feedback: feedback || '',
    });

    await survey.save();

    res.status(201).json({
      success: true,
      result: { message: 'Thank you for your feedback!' }
    });
  } catch (error) {
    console.error('Survey submission error:', error);
    res.status(500).json({ 
      success: false, 
      result: { message: 'Failed to submit survey' } 
    });
  }
};

export const getSurveyAnalytics = async (req, res) => {
  try {
    const totalResponses = await Survey.countDocuments();
    
    const optionCounts = await Survey.aggregate([
      { $group: { _id: '$option', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const recentResponses = await Survey.find()
      .sort({ submittedAt: -1 })
      .limit(10)
      .populate('user', 'firstName lastName email')
      .lean();

    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);
    const weeklyResponses = await Survey.countDocuments({ submittedAt: { $gte: thisWeek } });

    res.status(200).json({
      success: true,
      result: {
        data: {
          totalResponses,
          weeklyResponses,
          optionCounts: optionCounts.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
          }, {}),
          recentResponses,
        }
      }
    });
  } catch (error) {
    console.error('Survey analytics error:', error);
    res.status(500).json({ 
      success: false, 
      result: { message: 'Failed to fetch analytics' } 
    });
  }
};

export const getAdminSurveyAnalytics = async (req, res) => {
  try {
    const totalResponses = await Survey.countDocuments();
    
    const optionCounts = await Survey.aggregate([
      { $group: { _id: '$option', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const recentResponses = await Survey.find()
      .sort({ submittedAt: -1 })
      .limit(10)
      .populate('user', 'firstName lastName email')
      .lean();

    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);
    const weeklyResponses = await Survey.countDocuments({ submittedAt: { $gte: thisWeek } });

    res.status(200).json({
      success: true,
      result: {
        data: {
          totalResponses,
          weeklyResponses,
          optionCounts: optionCounts.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
          }, {}),
          recentResponses,
        }
      }
    });
  } catch (error) {
    console.error('Admin survey analytics error:', error);
    res.status(500).json({ 
      success: false, 
      result: { message: 'Failed to fetch analytics' } 
    });
  }
};
