import Package from '../models/Package.model.js';

export const getPackages = async (req, res) => {
  try {
    const packages = await Package.find({
      status: 'active',
      isDeleted: false
    }).sort({ price: 1 });

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
    const { name, description, price, commissionLv1, commissionLv2, features } = req.body;

    const packageData = new Package({
      name,
      description,
      price,
      commissionLv1,
      commissionLv2,
      features: features || []
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

    const { name, description, price, commissionLv1, commissionLv2, status, features } = req.body;

    if (name) packageData.name = name;
    if (description !== undefined) packageData.description = description;
    if (price !== undefined) packageData.price = price;
    if (commissionLv1 !== undefined) packageData.commissionLv1 = commissionLv1;
    if (commissionLv2 !== undefined) packageData.commissionLv2 = commissionLv2;
    if (status) packageData.status = status;
    if (features) packageData.features = features;

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

