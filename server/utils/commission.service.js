import Commission from '../models/Commission.model.js';
import User from '../models/User.model.js';
import Transaction from '../models/Transaction.model.js';
import BalanceHistory from '../models/BalanceHistory.model.js';

export const calculateCommissions = async (transaction, packageData) => {
  try {
    const buyer = await User.findById(transaction.userId);
    if (!buyer || !buyer.parentId) {
      return; // No parent, no commission
    }

    // Level 1 Commission (F1)
    const parent = await User.findById(buyer.parentId);
    if (parent) {
      const lv1Amount = (transaction.amount * packageData.commissionLv1) / 100;
      
      // Create commission record
      const commission1 = new Commission({
        userId: parent._id,
        transactionId: transaction._id,
        buyerId: buyer._id,
        packageId: packageData._id,
        level: 1,
        amount: lv1Amount,
        percentage: packageData.commissionLv1,
        orderAmount: transaction.amount,
        status: 'credited'
      });
      await commission1.save();

      // Update parent balance
      const balanceBefore = parent.walletBalance;
      parent.walletBalance += lv1Amount;
      parent.totalEarnings += lv1Amount;
      await parent.save();

      // Save balance history
      await BalanceHistory.create({
        userId: parent._id,
        type: 'commission',
        amount: lv1Amount,
        balanceBefore,
        balanceAfter: parent.walletBalance,
        description: `Level 1 commission from ${buyer.username} - ${packageData.name}`,
        relatedId: commission1._id,
        relatedType: 'commission'
      });

      // Create transaction record
      await Transaction.create({
        userId: parent._id,
        packageId: packageData._id,
        type: 'commission',
        amount: lv1Amount,
        status: 'completed',
        description: `Level 1 commission from ${buyer.username}`
      });

      // Level 2 Commission (F2)
      if (parent.parentId) {
        const grandParent = await User.findById(parent.parentId);
        if (grandParent) {
          const lv2Amount = (transaction.amount * packageData.commissionLv2) / 100;
          
          const commission2 = new Commission({
            userId: grandParent._id,
            transactionId: transaction._id,
            buyerId: buyer._id,
            packageId: packageData._id,
            level: 2,
            amount: lv2Amount,
            percentage: packageData.commissionLv2,
            orderAmount: transaction.amount,
            status: 'credited'
          });
          await commission2.save();

          // Update grandparent balance
          const balanceBeforeF2 = grandParent.walletBalance;
          grandParent.walletBalance += lv2Amount;
          grandParent.totalEarnings += lv2Amount;
          await grandParent.save();

          // Save balance history
          await BalanceHistory.create({
            userId: grandParent._id,
            type: 'commission',
            amount: lv2Amount,
            balanceBefore: balanceBeforeF2,
            balanceAfter: grandParent.walletBalance,
            description: `Level 2 commission from ${buyer.username} - ${packageData.name}`,
            relatedId: commission2._id,
            relatedType: 'commission'
          });

          await Transaction.create({
            userId: grandParent._id,
            packageId: packageData._id,
            type: 'commission',
            amount: lv2Amount,
            status: 'completed',
            description: `Level 2 commission from ${buyer.username}`
          });
        }
      }
    }
  } catch (error) {
    console.error('Commission calculation error:', error);
    throw error;
  }
};
