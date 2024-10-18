import React from "react";
import { getInitials } from "../../utiles/helper";

const ProfileInfo = ({ userInfo, onLogout }) => {
  return (
    <div className="flex items-center gap-3">
      {userInfo ? (
        <div className="w-12 h-12 flex items-center justify-center rounded-full text-gray-200 font-medium bg-gray-700">
          {getInitials(userInfo?.fullName)}
        </div>
      ) : (
        ""
      )}

      <div>
        <p className="text-sm font-medium">{userInfo?.fullName}</p>
        <button
          className=" text-sm text-slate-700 underline"
          onClick={onLogout}
        >
          Logout
          {userInfo && "Logout"}
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo;
