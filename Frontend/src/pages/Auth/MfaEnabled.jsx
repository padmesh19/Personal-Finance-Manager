import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { useNavigate, useSearchParams } from 'react-router'
import authServices from '../../services/authServices'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { fetchBudget } from '@/redux/features/budgetSlice'
import { fetchCategory } from '@/redux/features/categorySlice'
import { fetchTransaction } from '@/redux/features/transactionSlice'
import { fetchGoal } from '@/redux/features/goalSlice'
import { setEmail, setPassword } from '@/redux/features/registerSlice'
import { setUser } from '@/redux/features/userSlice'

const MfaEnabled = () => {
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams()
    const email = searchParams.get('email')

    const [mfaSecret, setMfaSecret] = useState('')
    const [error, setError] = useState('')

    const navigate = useNavigate()

    const validateInput = () => {
        if (!mfaSecret) {
            setError('Passcode is required.')
            return false
        }
        if (!/^\d{6}$/.test(mfaSecret)) {
            setError('Passcode must be exactly 6 digits.')
            return false
        }
        setError('')
        return true
    }

    const handleMfaSecret = async (e) => {
        e.preventDefault()
        if (!validateInput()) return

        try {
            const response = await authServices.mfaEnabled(email, mfaSecret)
            if (response.status === 200) {
                toast.success('Logged in successfully')

                // Fetch user data
                const userResponse = await authServices.me()
                dispatch(setUser(userResponse.data))

                // Clear form & fetch data
                dispatch(setEmail(''))
                dispatch(setPassword(''))
                dispatch(fetchBudget())
                dispatch(fetchCategory())
                dispatch(fetchTransaction())
                dispatch(fetchGoal())

                // Redirect to dashboard
                setTimeout(() => {
                    navigate('/dashboard', { replace: true })
                }, 500)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid passcode')
        }
    }

    return (
        <div className="lg:min-w-[30vw] px-8 py-6 shadow-xl border border-slate-100 rounded-sm bg-white">
            <div className="flex gap-6 flex-col">
                <div className="flex items-center justify-center flex-col gap-3">
                    <div className="text-slate-900 font-semibold text-2xl">
                        Passcode
                    </div>
                    <span className="text-slate-500 text-base">
                        Enter your Passcode to Login. You have enabled
                        Multi-Factor authentication.
                    </span>
                </div>
                <form
                    className="flex flex-col space-y-6"
                    onSubmit={handleMfaSecret}
                >
                    <div className="space-y-6">
                        <div className="flex flex-col gap-2">
                            <Label className="text-slate-700">Passcode</Label>
                            <Input
                                name="otp"
                                type="text"
                                placeholder="Enter Passcode"
                                className="h-10"
                                value={mfaSecret}
                                onChange={(e) => setMfaSecret(e.target.value)}
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
                        >
                            Submit
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default MfaEnabled
