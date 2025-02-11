import React from "react";
import { NavLink } from "react-router-dom";

const AdminMenu = () => {
  return (
    <div className="text-center">
      <h4 className="font-semibold text-3xl my-4 text-blue-800">Admin Panel</h4>
      <div className="space-y-1">
        <NavLink
          to="/dashboard/admin/create-genre"
          className="block py-2 px-4 bg-blue-800 text-white hover:bg-blue-700 rounded-md transition duration-300"
        >
          Create Genre
        </NavLink>
        <NavLink
          to="/dashboard/admin/add-author"
          className="block py-2 px-4 bg-sky-800 text-white hover:bg-blue-700 rounded-md transition duration-300"
        >
          Add Authors
        </NavLink>
        <NavLink
          to="/dashboard/admin/create-book"
          className="block py-2 px-4 bg-blue-800 text-white hover:bg-blue-700 rounded-md transition duration-300"
        >
          Add Books
        </NavLink>
        <NavLink
          to="/dashboard/admin/books"
          className="block py-2 px-4 bg-sky-800 text-white hover:bg-blue-700 rounded-md transition duration-300"
        >
          All Books
        </NavLink>
        <NavLink
          to="/dashboard/admin/users"
          className="block py-2 px-4 bg-blue-800 text-white hover:bg-blue-700 rounded-md transition duration-300"
        >
          All Users
        </NavLink>
        <NavLink
          to="/dashboard/admin/order"
          className="block py-2 px-4 bg-sky-800 text-white hover:bg-sky-800 rounded-md transition duration-300"
        >
          All Orders
        </NavLink>
      </div>
    </div>
  );
};

export default AdminMenu;
