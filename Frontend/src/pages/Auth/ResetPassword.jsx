import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { useNavigate, useSearchParams } from 'react-router'
import authServices from '../../services/authServices'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const ResetPassword = () => {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errors, setErrors] = useState({ password: '', confirmPassword: '' })

    const [searchParams] = useSearchParams()
    const resetToken = searchParams.get('resetToken')
    const navigate = useNavigate()

    const validateInputs = () => {
        let isValid = true
        let newErrors = { password: '', confirmPassword: '' }

        if (!password) {
            newErrors.password = 'Password is required.'
            isValid = false
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters.'
            isValid = false
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Confirm Password is required.'
            isValid = false
        } else if (confirmPassword !== password) {
            newErrors.confirmPassword = 'Passwords do not match.'
            isValid = false
        }

        setErrors(newErrors)
        return isValid
    }

    const handleResetPassword = async (e) => {
        e.preventDefault()
        if (!validateInputs()) return

        try {
            const response = await authServices.resetPassword(
                resetToken,
                password
            )
            if (response.status === 200) {
                toast.success('Password reset successful')
                navigate('/auth/login')
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || 'Password reset failed'
            )
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
                        The password should have at least 6 characters
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {errors.password && (
                                <span className="text-red-500 text-sm">
                                    {errors.password}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label className="text-slate-700">
                                Confirm Password
                            </Label>
                            <Input
                                name="confirmPassword"
                                type="password"
                                placeholder="Enter confirm password"
                                className="h-10"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                            />
                            {errors.confirmPassword && (
                                <span className="text-red-500 text-sm">
                                    {errors.confirmPassword}
                                </span>
                            )}
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
