import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import { formatDate } from '../utils/dateFormat'

export default function Blog() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      const response = await api.get('/blogs')
      setBlogs(response.data.data)
    } catch (error) {
      console.error('Failed to load blogs')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">Loading blogs...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Blog & News</h1>
      
      {blogs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No blog posts available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <Link
              key={blog._id}
              to={`/blog/${blog.slug}`}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{blog.excerpt}</p>
              <div className="text-sm text-gray-400">
                {formatDate(blog.createdAt)}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

