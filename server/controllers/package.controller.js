import Package from '../models/Package.model.js';

export const getPackages = async (req, res) => {
  try {
    const { packageId } = req.query;
    // Check if the requester is an admin (using the auth middleware which sets req.admin or req.user)
    const isAdmin = !!req.admin;
    const userReferredPackageId = req.user?.referredPackageId;
    
    let query = {
      status: 'active',
      isDeleted: false
    };

    if (packageId && packageId !== "null" && packageId !== "undefined") {
      query._id = packageId;
    } else if (userReferredPackageId && !isAdmin) {
      // If user has a referred package, only show that one
      query._id = userReferredPackageId;
    } else if (!isAdmin) {
      // Only hide packages for regular users, not admins
      // Use $ne: true to include packages where isHidden field might be missing (default false)
      query.isHidden = { $ne: true };
    }

    const packages = await Package.find(query).sort({ price: 1 });

    res.json({
      success: true,
      data: packages
    });
  } catch (error) {
    console.error('Get packages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get packages'
    });
  }
};

export const getPackageById = async (req, res) => {
  try {
    const packageData = await Package.findById(req.params.id);

    if (!packageData || packageData.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    res.json({
      success: true,
      data: packageData
    });
  } catch (error) {
    console.error('Get package error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get package'
    });
  }
};

export const createPackage = async (req, res) => {
  try {
    const { name, description, price, commissionLv1, commissionLv2, features, isHidden } = req.body;

    const packageData = new Package({
      name,
      description,
      price,
      commissionLv1,
      commissionLv2,
      features: features || [],
      isHidden: isHidden || false
    });

    await packageData.save();

    res.status(201).json({
      success: true,
      message: 'Package created successfully',
      data: packageData
    });
  } catch (error) {
    console.error('Create package error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create package'
    });
  }
};

export const updatePackage = async (req, res) => {
  try {
    const packageData = await Package.findById(req.params.id);

    if (!packageData) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    const { name, description, price, commissionLv1, commissionLv2, status, features, isHidden } = req.body;

    if (name) packageData.name = name;
    if (description !== undefined) packageData.description = description;
    if (price !== undefined) packageData.price = price;
    if (commissionLv1 !== undefined) packageData.commissionLv1 = commissionLv1;
    if (commissionLv2 !== undefined) packageData.commissionLv2 = commissionLv2;
    if (status) packageData.status = status;
    if (features) packageData.features = features;
    if (isHidden !== undefined) packageData.isHidden = isHidden;

    await packageData.save();

    res.json({
      success: true,
      message: 'Package updated successfully',
      data: packageData
    });
  } catch (error) {
    console.error('Update package error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update package'
    });
  }
};

export const deletePackage = async (req, res) => {
  try {
    const packageData = await Package.findById(req.params.id);

    if (!packageData) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    // Soft delete
    packageData.isDeleted = true;
    packageData.status = 'inactive';
    await packageData.save();

    res.json({
      success: true,
      message: 'Package deleted successfully'
    });
  } catch (error) {
    console.error('Delete package error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete package'
    });
  }
};

