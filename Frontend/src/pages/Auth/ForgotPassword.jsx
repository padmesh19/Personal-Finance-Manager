import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router'
import authServices from '../../services/authServices'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Mail } from 'lucide-react'

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [isEmailSent, setIsEmailSent] = useState(false)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const validateEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!email) {
            setError('Email is required.')
            return false
        } else if (!emailRegex.test(email)) {
            setError('Enter a valid email address.')
            return false
        }
        setError('')
        return true
    }

    const handleForgotPassword = async (e) => {
        e.preventDefault()
        if (!validateEmail()) return

        try {
            const response = await authServices.forgotPassword(email)
            if (response.status === 200) {
                setIsEmailSent(true)
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || 'Something went wrong.'
            )
        }
    }

    return (
        <>
            {!isEmailSent ? (
                <div className="lg:min-w-[30vw] mx-auto px-8 py-6 shadow-xl border border-slate-100 rounded-lg bg-white">
                    <div className="flex gap-6 flex-col">
                        <div className="flex items-center justify-center flex-col gap-3">
                            <div className="text-slate-900 font-semibold text-2xl">
                                Forgot Password?
                            </div>
                            <span className="text-slate-500 text-base">
                                No worries, we will send you reset instructions.
                            </span>
                        </div>
                        <form
                            className="flex flex-col space-y-6"
                            onSubmit={handleForgotPassword}
                        >
                            <div className="space-y-6">
                                <div className="flex flex-col gap-2">
                                    <Label className="text-slate-700">
                                        Email
                                    </Label>
                                    <Input
                                        name="email"
                                        type="email"
                                        placeholder="Enter email"
                                        className="h-10"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        onBlur={validateEmail}
                                    />
                                    {error && (
                                        <span className="text-red-500 text-sm">
                                            {error}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col gap-4">
                                <Button
                                    className="bg-slate-800 text-md font-semibold w-full"
                                    size="lg"
                                    type="submit"
                                >
                                    Submit
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="lg:min-w-[30vw] max-w-[550px] mx-auto px-8 py-6 shadow-xl border border-slate-100 rounded-sm bg-white flex flex-col gap-6">
                    <div className="flex gap-2 flex-col items-center justify-center">
                        <Mail color="orange" size={80} />
                        <div className="text-slate-800 text-2xl font-semibold mt-5">
                            Check Your Inbox
                        </div>
                        <div className="text-slate-600 text-base text-center mt-2">
                            We have sent you an OTP and a verification link to
                            reset your password. Please check your inbox and
                            click the verification link.
                        </div>
                    </div>
                    <div className="flex justify-between items-center mt-5 w-full">
                        <Link
                            to="/auth/login"
                            className="text-sm font-semibold bg-slate-800 p-2 px-3 text-white w-full text-center rounded-sm"
                        >
                            Go back to Sign In
                        </Link>
                    </div>
                </div>
            )}
        </>
    )
}

export default ForgotPassword
