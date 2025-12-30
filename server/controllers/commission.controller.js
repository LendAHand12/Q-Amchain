import Commission from '../models/Commission.model.js';

export const getCommissions = async (req, res) => {
  try {
    const commissions = await Commission.find({ userId: req.user._id })
      .populate('buyerId', 'username email')
      .populate('packageId', 'name')
      .populate('transactionId', 'transactionHash amount')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({
      success: true,
      data: commissions
    });
  } catch (error) {
    console.error('Get commissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get commissions'
    });
  }
};

export const getCommissionStats = async (req, res) => {
  try {
    const stats = await Commission.aggregate([
      { $match: { userId: req.user._id, status: 'credited' } },
      {
        $group: {
          _id: '$level',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    const f1Stats = stats.find(s => s._id === 1) || { total: 0, count: 0 };
    const f2Stats = stats.find(s => s._id === 2) || { total: 0, count: 0 };

    res.json({
      success: true,
      data: {
        level1: {
          total: f1Stats.total,
          count: f1Stats.count
        },
        level2: {
          total: f2Stats.total,
          count: f2Stats.count
        },
        total: f1Stats.total + f2Stats.total
      }
    });
  } catch (error) {
    console.error('Get commission stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get commission stats'
    });
  }
};

