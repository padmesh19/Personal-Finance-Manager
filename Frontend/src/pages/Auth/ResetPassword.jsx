import {useDispatch, useSelector} from "react-redux"
import {selectPassword, setPassword} from "../../redux/features/loginSlice"
import {toast} from "react-toastify"
import {useNavigate, useSearchParams} from "react-router"
import authServices from "../../services/authServices"

import {Label} from "@/components/ui/label"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"

const ResetPassword = () => {
  let password = "";
  let confirmPassword = "";
  const [searchParams, setSearchParams] = useSearchParams();
  const resetToken = searchParams.get("resetToken");
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleResetPassword = async e => {
    e.preventDefault()
    try {
      const response = await authServices.resetPassword(resetToken, password);
      if (response.status == 200) {
        toast.success("Password reset successful")
        navigate("/auth/login");
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  }

  return (
    <div className="lg:min-w-[30vw] px-8 py-6 shadow-xl border border-slate-100 rounded-lg bg-white">
      <div className="flex gap-6 flex-col">
        <div className="flex items-center justify-center flex-col gap-3">
          <div className="text-slate-900 font-semibold text-2xl">
            Reset Password
          </div>
          <span className="text-slate-500 text-base">
            The password should have atleast 6 characters
          </span>
        </div>
        <form
          className="flex flex-col space-y-6"
          onSubmit={handleResetPassword}
        >
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <Label className="text-slate-700">Password</Label>
              <Input
                name="password"
                type="password"
                placeholder="Enter password"
                className="h-10"
                onChange={e => password=e.target.value}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-slate-700">Confirm Password</Label>
              <Input
                name="confirmPassword"
                type="password"
                placeholder="Enter confirm password"
                className="h-10"
                onChange={e => confirmPassword=e.target.value}
              />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <Button
              className="bg-slate-800 text-md font-semibold w-full"
              size="lg"
            >
              Reset Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword
