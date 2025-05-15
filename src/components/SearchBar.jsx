import React from "react";
import { FaSearch } from "react-icons/fa";

function SearchBar({ onSearch }) {
  return (
    <div className="mb-6 max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search cars by brand or model..."
          className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
        />
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>
    </div>
  );
}

export default SearchBar;
