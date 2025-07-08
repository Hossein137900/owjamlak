"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  FaReply,
  FaThumbsUp,
  FaTrash,
  FaExclamationTriangle,
} from "react-icons/fa";
import CommentSkeleton from "./commentSkeleton";

// Types for our comments
interface Comment {
  id: string;
  name: string;
  text: string;
  date: string;
  likes: number;
  replies: Reply[];
}

interface Reply {
  id: string;
  name: string;
  text: string;
  date: string;
}

interface BlogCommentSectionProps {
  blogId: string;
}

const BlogCommentSection: React.FC<BlogCommentSectionProps> = ({ blogId }) => {
  // State for comments
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState({ name: "", text: "" });
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [newReply, setNewReply] = useState({ name: "", text: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "mostLiked">(
    "newest"
  );

  // Load comments from localStorage on component mount
  useEffect(() => {
    setIsLoading(true);
    // Simulate loading delay
    const timer = setTimeout(() => {
      const savedComments = localStorage.getItem(`blog_comments_${blogId}`);
      if (savedComments) {
        setComments(JSON.parse(savedComments));
      }
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [blogId]);

  // Save comments to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(`blog_comments_${blogId}`, JSON.stringify(comments));
    }
  }, [comments, blogId, isLoading]);

  // Handle adding a new comment
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.name.trim() || !newComment.text.trim()) {
      setErrorMessage("لطفا نام و متن نظر را وارد کنید");
      return;
    }

    setErrorMessage("");

    const comment: Comment = {
      id: Date.now().toString(),
      name: newComment.name,
      text: newComment.text,
      date: new Date().toLocaleDateString("fa-IR"),
      likes: 0,
      replies: [],
    };

    setComments([comment, ...comments]);
    setNewComment({ name: "", text: "" });
  };

  // Handle adding a reply to a comment
  const handleAddReply = (commentId: string, e: React.FormEvent) => {
    e.preventDefault();

    if (!newReply.name.trim() || !newReply.text.trim()) {
      setErrorMessage("لطفا نام و متن پاسخ را وارد کنید");
      return;
    }

    setErrorMessage("");

    const reply: Reply = {
      id: Date.now().toString(),
      name: newReply.name,
      text: newReply.text,
      date: new Date().toLocaleDateString("fa-IR"),
    };

    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...comment.replies, reply],
        };
      }
      return comment;
    });

    setComments(updatedComments);
    setNewReply({ name: "", text: "" });
    setReplyingTo(null);
  };

  // Handle liking a comment
  const handleLikeComment = (commentId: string) => {
    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          likes: comment.likes + 1,
        };
      }
      return comment;
    });

    setComments(updatedComments);
  };

  // Handle deleting a comment
  const handleDeleteComment = (commentId: string) => {
    if (window.confirm("آیا از حذف این نظر اطمینان دارید؟")) {
      const updatedComments = comments.filter(
        (comment) => comment.id !== commentId
      );
      setComments(updatedComments);
    }
  };

  // Sort comments based on selected order
  const sortedComments = [...comments].sort((a, b) => {
    if (sortOrder === "newest") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortOrder === "oldest") {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    } else {
      return b.likes - a.likes;
    }
  });

  return (
    <div className="bg-white rounded-lg">
      {/* Add new comment form */}
      <div className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h4 className="text-lg font-bold mb-4 text-right">ارسال نظر جدید</h4>
        <form onSubmit={handleAddComment} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 text-right mb-1"
            >
              نام شما
            </label>
            <input
              type="text"
              id="name"
              value={newComment.name}
              onChange={(e) =>
                setNewComment({ ...newComment, name: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-right"
              placeholder="نام خود را وارد کنید"
            />
          </div>
          <div>
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-gray-700 text-right mb-1"
            >
              متن نظر
            </label>
            <textarea
              id="comment"
              rows={4}
              value={newComment.text}
              onChange={(e) =>
                setNewComment({ ...newComment, text: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-right"
              placeholder="نظر خود را بنویسید..."
            ></textarea>
          </div>
          {errorMessage && (
            <p className="text-red-500 text-right text-sm">{errorMessage}</p>
          )}
          <div className="text-left">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              ارسال نظر
            </button>
          </div>
        </form>
      </div>

      {/* Comments sorting */}
      {!isLoading && comments.length > 0 && (
        <div className="flex justify-end mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">مرتب‌سازی:</span>
            <select
              value={sortOrder}
              onChange={(e) =>
                setSortOrder(
                  e.target.value as "newest" | "oldest" | "mostLiked"
                )
              }
              className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="newest">جدیدترین</option>
              <option value="oldest">قدیمی‌ترین</option>
              <option value="mostLiked">محبوب‌ترین</option>
            </select>
          </div>
        </div>
      )}

      {/* Comments list */}
      <div className="space-y-6">
        {isLoading ? (
          // Show skeletons while loading
          <>
            <CommentSkeleton />
            <CommentSkeleton />
            <CommentSkeleton />
          </>
        ) : comments.length === 0 ? (
          <div className="text-center py-10 border border-gray-200 rounded-lg">
            <FaExclamationTriangle className="mx-auto text-gray-400 text-3xl mb-3" />
            <p className="text-gray-500">
              هنوز نظری ثبت نشده است. اولین نفری باشید که نظر می‌دهید!
            </p>
          </div>
        ) : (
          sortedComments.map((comment) => (
            <div
              key={comment.id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleLikeComment(comment.id)}
                    className="text-gray-500 hover:text-blue-600 transition-colors"
                    title="پسندیدن"
                  >
                    <FaThumbsUp />
                  </button>
                  <span className="text-sm text-gray-600">{comment.likes}</span>
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-gray-500 hover:text-red-600 transition-colors ml-2"
                    title="حذف نظر"
                  >
                    <FaTrash />
                  </button>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex flex-col text-right">
                    <h5 className="font-bold text-gray-900">{comment.name}</h5>
                    <span className="text-sm text-gray-500">
                      {comment.date}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300 flex-shrink-0">
                    <Image
                      src="/assets/images/avatar-placeholder.jpg"
                      alt={comment.name}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

              <div className="text-right mb-4">
                <p className="text-gray-800">{comment.text}</p>
              </div>

              <div className="text-left mb-4">
                <button
                  onClick={() =>
                    setReplyingTo(replyingTo === comment.id ? null : comment.id)
                  }
                  className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
                >
                  <FaReply />
                  <span>{replyingTo === comment.id ? "انصراف" : "پاسخ"}</span>
                </button>
              </div>

              {/* Reply form */}
              {replyingTo === comment.id && (
                <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
                  <h5 className="text-md font-bold mb-3 text-right">
                    ارسال پاسخ
                  </h5>
                  <form
                    onSubmit={(e) => handleAddReply(comment.id, e)}
                    className="space-y-3"
                  >
                    <div>
                      <label
                        htmlFor={`reply-name-${comment.id}`}
                        className="block text-sm font-medium text-gray-700 text-right mb-1"
                      >
                        نام شما
                      </label>
                      <input
                        type="text"
                        id={`reply-name-${comment.id}`}
                        value={newReply.name}
                        onChange={(e) =>
                          setNewReply({ ...newReply, name: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-right"
                        placeholder="نام خود را وارد کنید"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`reply-text-${comment.id}`}
                        className="block text-sm font-medium text-gray-700 text-right mb-1"
                      >
                        متن پاسخ
                      </label>
                      <textarea
                        id={`reply-text-${comment.id}`}
                        rows={3}
                        value={newReply.text}
                        onChange={(e) =>
                          setNewReply({ ...newReply, text: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-right"
                        placeholder="پاسخ خود را بنویسید..."
                      ></textarea>
                    </div>
                    {errorMessage && (
                      <p className="text-red-500 text-right text-sm">
                        {errorMessage}
                      </p>
                    )}
                    <div className="text-left">
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        ارسال پاسخ
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Replies list */}
              {comment.replies.length > 0 && (
                <div className="mt-4 space-y-4 border-r-2 border-gray-200 pr-4 mr-4">
                  <h6 className="text-sm font-bold text-gray-700 text-right mb-2">
                    پاسخ‌ها ({comment.replies.length})
                  </h6>
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-end items-start mb-2">
                        <div className="flex items-start gap-2">
                          <div className="flex flex-col text-right">
                            <h6 className="font-bold text-gray-900">
                              {reply.name}
                            </h6>
                            <span className="text-xs text-gray-500">
                              {reply.date}
                            </span>
                          </div>
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300 flex-shrink-0">
                            <Image
                              src="/assets/images/avatar-placeholder.jpg"
                              alt={reply.name}
                              width={32}
                              height={32}
                              className="object-cover"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-800 text-sm">{reply.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination placeholder - for future implementation */}
      {!isLoading && comments.length > 5 && (
        <div className="mt-8 flex justify-center">
          <nav className="flex items-center gap-1">
            <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50">
              قبلی
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md bg-blue-600 text-white">
              1
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50">
              3
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50">
              بعدی
            </button>
          </nav>
        </div>
      )}

      {/* Show comment count */}
      {!isLoading && (
        <div className="mt-6 text-right text-gray-600">
          <p>
            {comments.length} نظر ثبت شده
            {comments.reduce(
              (total, comment) => total + comment.replies.length,
              0
            ) > 0 &&
              ` (به همراه ${comments.reduce(
                (total, comment) => total + comment.replies.length,
                0
              )} پاسخ)`}
          </p>
        </div>
      )}
    </div>
  );
};

export default BlogCommentSection;
