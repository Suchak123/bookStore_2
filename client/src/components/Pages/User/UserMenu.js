import React from "react";
import { NavLink } from "react-router-dom";

const UserMenu = () => {
  return (
    <div className="text-center">
      <h4 className="londrina-color md:text-3xl text-xl my-4">
        User Dashboard
      </h4>
      <div className="space-y-1 w-[300px] mx-auto">
        <NavLink
          to="/dashboard/user/profile"
          className="bona block md:py-2 py-1 md:px-4 px-2 bg-sky-800 text-white hover:bg-blue-800 rounded-md transition duration-300"
        >
          My Profile
        </NavLink>
        <NavLink
          to="/dashboard/user/orders"
          className="bona block md:py-2 py-1 md:px-4 px-2 bg-sky-800 text-white hover:bg-blue-800 rounded-md transition duration-300"
        >
          My Orders
        </NavLink>
      </div>
    </div>
  );
};

export default UserMenu;
