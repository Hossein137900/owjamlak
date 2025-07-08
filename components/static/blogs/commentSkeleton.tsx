import React from "react";

const CommentSkeleton: React.FC = () => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="h-4 w-16 bg-gray-200 rounded"></div>
        <div className="flex items-start gap-3">
          <div className="flex flex-col text-right">
            <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 w-16 bg-gray-200 rounded"></div>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-200"></div>
        </div>
      </div>
      <div className="text-right mb-4">
        <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

export default CommentSkeleton;
