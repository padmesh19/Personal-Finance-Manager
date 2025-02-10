import { useEffect } from "react";
import { toast } from "react-toastify";
import authServices from "../services/authServices";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { clearUser } from "../redux/features/userSlice";

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    logoutUser();
  }, []);

  return <div>Logging Out...Please Wait...</div>;
};

export default Logout;
