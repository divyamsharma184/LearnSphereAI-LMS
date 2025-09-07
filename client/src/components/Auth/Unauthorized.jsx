import React from 'react';

const Unauthorized = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-red-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600">403 - Unauthorized</h1>
        <p className="mt-4 text-lg text-red-500">
          You do not have permission to access this page.
        </p>
      </div>
    </div>
  );
};

export default Unauthorized;
