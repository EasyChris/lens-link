import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center w-full h-full fixed top-0 left-0 bg-gray-900 bg-opacity-50 z-50">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-300"></div>
    </div>
  );
};

export default Loading;
