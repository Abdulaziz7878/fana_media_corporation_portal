import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50 text-center p-4">
      <h1 className="text-6xl font-bold text-yellow-500 mb-4">403</h1>
      <h2 className="text-2xl font-semibold mb-2">Unauthorized</h2>
      <p className="text-gray-700 mb-6">
        You do not have permission to view this page.
      </p>
      <Link
        to="/"
        className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition duration-200"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default Unauthorized;