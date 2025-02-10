import {Outlet} from "react-router-dom"

import AuthNavbar from "@/components/AuthNavbar"

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-[#f5f5f5] roboto">
      <div className="min-h-[10vh]">
        <AuthNavbar />
      </div>
      <div className="flex justify-center items-center min-h-[90vh]">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout
