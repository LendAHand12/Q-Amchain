import Blog from '../models/Blog.model.js';

export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ status: 'published' })
      .populate('author', 'username')
      .select('-content')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      data: blogs
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get blogs'
    });
  }
};

export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, status: 'published' })
      .populate('author', 'username email');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Increment views
    blog.views += 1;
    await blog.save();

    res.json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get blog'
    });
  }
};

export const createBlog = async (req, res) => {
  try {
    const { title, content, excerpt, status, tags, featuredImage } = req.body;

    const slug = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const blog = new Blog({
      title,
      slug,
      content,
      excerpt,
      status: status || 'draft',
      author: req.admin._id,
      tags: tags || [],
      featuredImage
    });

    await blog.save();

    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: blog
    });
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create blog'
    });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    const { title, content, excerpt, status, tags, featuredImage } = req.body;

    if (title) {
      blog.title = title;
      blog.slug = title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    if (content) blog.content = content;
    if (excerpt !== undefined) blog.excerpt = excerpt;
    if (status) blog.status = status;
    if (tags) blog.tags = tags;
    if (featuredImage) blog.featuredImage = featuredImage;

    await blog.save();

    res.json({
      success: true,
      message: 'Blog updated successfully',
      data: blog
    });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update blog'
    });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    await blog.deleteOne();

    res.json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete blog'
    });
  }
};

