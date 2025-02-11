import React from "react";

const GenreForm = ({ handleSubmit, value, setValue }) => {
  return (
    <form onSubmit={handleSubmit} className="mb-3">
      <input
        type="text"
        className="border border-gray-300 rounded-lg p-2 w-full"
        placeholder="Enter new genre"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        type="submit"
        className="bg-sky-800 hover:bg-sky-900 text-white font-semibold py-2 px-4 rounded-lg mt-2"
      >
        Submit
      </button>
    </form>
  );
};

export default GenreForm;
