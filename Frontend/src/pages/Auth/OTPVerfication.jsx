import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { useNavigate, useSearchParams } from 'react-router'
import authServices from '../../services/authServices'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

const OTPverification = () => {
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    let email = searchParams.get('email')
    const [otp, setOtp] = useState('')
    const [error, setError] = useState('')

    const validateOTP = () => {
        if (!otp) {
            setError('OTP is required.')
            return false
        }
        if (!/^\d{6}$/.test(otp)) {
            setError('OTP must be exactly 6 digits.')
            return false
        }
        setError('')
        return true
    }

    const handleOTPverification = async (e) => {
        e.preventDefault()
        if (!validateOTP()) return

        try {
            const response = await authServices.verifyOtp(email, otp)
            if (response.status === 200) {
                toast.success('Email verified successfully')
                navigate('/auth/login')
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || 'OTP verification failed'
            )
        }
    }

    return (
        <div className="lg:min-w-[30vw] px-8 py-6 shadow-xl border border-slate-100 rounded-sm bg-white">
            <div className="flex gap-6 flex-col">
                <div className="flex items-center justify-center flex-col gap-3">
                    <div className="text-slate-900 font-semibold text-2xl">
                        OTP Verification
                    </div>
                    <span className="text-slate-500 text-base">
                        Enter the OTP code sent to your email
                    </span>
                </div>
                <form
                    className="flex flex-col space-y-6"
                    onSubmit={handleOTPverification}
                >
                    <div className="space-y-6">
                        <div className="flex flex-col gap-2">
                            <Label className="text-slate-700">OTP</Label>
                            <Input
                                name="otp"
                                type="text"
                                placeholder="Enter OTP"
                                className="h-10"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
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

export default OTPverification
