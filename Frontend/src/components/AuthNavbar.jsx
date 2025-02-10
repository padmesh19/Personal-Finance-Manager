import {Link} from "react-router-dom"

const AuthNavbar = () => {
  return (
    <div className="items-center bg-white px-4 mx-auto md:flex md:px-8 justify-between">
      <div className="flex items-center justify-between py-3 md:block">
        <Link to="/auth/login" className=" comic cursor-pointer">
          <div className="flex flex-col items-center">
            <p className="text-slate-700 text-base font-bold">Finance</p>
            <p className="text-2xl leading-none font-semibold text-orange-500">
              Manager
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default AuthNavbar
