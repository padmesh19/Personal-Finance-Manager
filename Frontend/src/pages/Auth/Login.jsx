import { useDispatch, useSelector } from 'react-redux'
import {
    selectEmail,
    selectPassword,
    setEmail,
    setPassword,
} from '../../redux/features/loginSlice'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router'
import authServices from '../../services/authServices'
import { setIsLoading, setUser, userState } from '../../redux/features/userSlice'
import { fetchBudget } from '@/redux/features/budgetSlice'
import { fetchCategory } from '@/redux/features/categorySlice'
import { fetchTransaction } from '@/redux/features/transactionSlice'
import { fetchGoal } from '@/redux/features/goalSlice'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

const Login = () => {
    const email = useSelector(selectEmail)
    const password = useSelector(selectPassword)
    const {user} = useSelector(userState)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [errors, setErrors] = useState({ email: '', password: '' })

    const validateInputs = () => {
        let valid = true
        let newErrors = { email: '', password: '' }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!email) {
            newErrors.email = 'Email is required.'
            valid = false
        } else if (!emailRegex.test(email)) {
            newErrors.email = 'Enter a valid email address.'
            valid = false
        }

        // Password validation
        if (!password) {
            newErrors.password = 'Password is required.'
            valid = false
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters.'
            valid = false
        }

        setErrors(newErrors)
        return valid
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        if (!validateInputs()) return

        try {
            const response = await authServices.login({ email, password })

            if (response.status === 200) {
                if (response.data.message === 'mfa-enabled') {
                    navigate(`/auth/mfa-enabled?email=${email}`, {
                        replace: true,
                    })
                } else {
                    toast.success('Logged in successfully')

                    // call the authLoader to get the user data
                    const response = await authServices.me()
                    dispatch(setUser(response.data))

                    // clear the form
                    dispatch(setEmail(''))
                    dispatch(setPassword(''))
                    dispatch(setIsLoading(false))

                    // redirect to home page
                    setTimeout(() => {
                        navigate('/dashboard', { replace: true })
                    }, 500)
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed')
        }
    }

    return (
        <div className="lg:min-w-[30vw] px-8 py-6 shadow-xl border border-slate-100 rounded-lg bg-white">
            <div className="flex gap-6 flex-col">
                <div className="flex items-center justify-center flex-col gap-3">
                    <div className="text-slate-900 font-semibold text-2xl">
                        Welcome Back!
                    </div>
                    <span className="text-slate-500 text-base">
                        Enter your credentials to login into your account
                    </span>
                </div>
                <form
                    className="flex flex-col space-y-6"
                    onSubmit={handleLogin}
                >
                    <div className="space-y-6">
                        <div className="flex flex-col gap-2">
                            <Label className="text-slate-700">Email</Label>
                            <Input
                                name="email"
                                type="email"
                                placeholder="Enter email"
                                className="h-10"
                                value={email}
                                onChange={(e) =>
                                    dispatch(setEmail(e.target.value))
                                }
                            />
                            {errors.email && (
                                <span className="text-red-500 text-sm">
                                    {errors.email}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <Label className="text-slate-700">
                                    Password
                                </Label>
                                <Link
                                    to="/auth/forgot-password"
                                    className="flex justify-end items-center text-orange-500 underline text-sm font-medium"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <Input
                                name="password"
                                type="password"
                                placeholder="Enter password"
                                className="h-10"
                                value={password}
                                onChange={(e) =>
                                    dispatch(setPassword(e.target.value))
                                }
                            />
                            {errors.password && (
                                <span className="text-red-500 text-sm">
                                    {errors.password}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <Button
                            className="bg-slate-800 text-md font-semibold w-full"
                            size="lg"
                        >
                            Sign In
                        </Button>
                        <div className="flex justify-between items-center">
                            <div className="text-base">
                                Don&apos;t have an account?
                            </div>
                            <Link
                                to="/auth/register"
                                className="underline text-orange-500 text-sm font-medium"
                            >
                                Click here
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login
