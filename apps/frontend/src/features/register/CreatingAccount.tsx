import React from "react";

const CreatingAccount: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
        Creating Your Account
      </h2>
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      <p className="text-gray-600 dark:text-gray-400">
        Please wait while we set up your account...
      </p>
    </div>
  );
};

export default CreatingAccount;
