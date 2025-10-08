import { motion } from "framer-motion";
import BlogCard from "./blogCard";

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  coverImage: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  contentHtml?: string;
  tableOfContents?: { id: string; title: string }[];
}

interface BlogGridProps {
  blogs: Blog[];
}

const BlogGrid: React.FC<BlogGridProps> = ({ blogs }) => {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {blogs.map((blog) => (
        <motion.div key={blog.id} variants={item}>
          <BlogCard
            id={blog.id}
            title={blog.title}
            excerpt={blog.excerpt}
            coverImage={blog.coverImage || "/assets/images/hero2.png"}
            author={blog.author}
            date={blog.date}
            readTime={blog.readTime}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default BlogGrid;
