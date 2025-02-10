import { userState } from '@/redux/features/userSlice'
import { useSelector } from 'react-redux'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '../../../components/ui/avatar'
import { Switch } from '@/components/ui/switch'
import { KeyRound, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'react-toastify'
import authServices from '@/services/authServices'
import EditProfileForm from './EditProfileForm'
import { useState } from 'react'

const Profile = () => {
    const { user } = useSelector(userState)
    const [isOpen, setIsOpen] = useState(false)
    const [data, setData] = useState(null)
    const toggle = () => {
        setIsOpen(!isOpen)
    }

    const handleResetPassword = async (e) => {
        e.preventDefault()
        if (confirm('Do you really want to Change your password')) {
            try {
                const response = await authServices.forgotPassword(user?.email)

                if (response.status === 200) {
                    toast.success('Password reset Link sent to mail')
                }
            } catch (error) {
                toast.error(error.response.data.message)
            }
        }
    }
    return (
        <>
            <div className="flex justify-center items-center p-6 min-h-[60vh]">
                <div className="lg:min-w-[30vw] w-full sm:max-w-[600px] px-8 py-6 shadow-xl border border-slate-100 rounded-sm bg-white">
                    <div className="flex gap-6 flex-col">
                        <div className="flex items-center justify-center flex-col gap-3">
                            <div className="text-slate-900 tracking-wide font-semibold text-2xl">
                                PROFILE INFORMATION
                            </div>
                            <span className="text-slate-500 text-base">
                                view and update your profile here
                            </span>
                        </div>
                        <form className="flex flex-col space-y-6">
                            <div className="space-y-6">
                                <div className="flex flex-col justify-center items-center gap-2">
                                    <Avatar className="w-20 h-20">
                                        <AvatarFallback className="bg-slate-100 text-3xl text-white">
                                            <img
                                                src="/bird.png"
                                                className="w-14"
                                            />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col self-start gap-2 w-full">
                                        <h2 className="text-lg font-semibold p-2">
                                            Name
                                        </h2>
                                        <Input
                                            className="placeholder-black font-semibold p-2 bg-slate-200 text-secondary-foreground rounded-sm w-full"
                                            placeholder={user?.name}
                                            disabled
                                        />
                                    </div>
                                    <div className="flex flex-col self-start gap-2 w-full">
                                        <h2 className="text-lg font-semibold p-2">
                                            Email
                                        </h2>
                                        <Input
                                            className="placeholder-black font-semibold p-2 bg-slate-200 text-secondary-foreground rounded-sm w-full"
                                            placeholder={user?.email}
                                            disabled
                                        />
                                    </div>
                                    <div className="flex flex-col self-start gap-2 w-full">
                                        <h2 className="text-lg font-semibold p-2">
                                            Currency
                                        </h2>
                                        <Input
                                            className="placeholder-black font-semibold p-2 bg-slate-200 text-secondary-foreground rounded-sm w-full"
                                            placeholder={user?.currency}
                                            disabled
                                        />
                                    </div>
                                    <div className="flex self-start items-center gap-4 w-full">
                                        <h2 className="text-lg font-semibold p-2">
                                            MFA{' '}
                                            <span className="text-sm text-slate-800">
                                                (Multi Factor Authentication)
                                            </span>
                                        </h2>
                                        <Switch
                                            checked={user?.mfaEnabled}
                                            disabled
                                            aria-readonly
                                        />
                                    </div>
                                    {user?.mfaEnabled && (
                                        <div className="flex flex-col self-start gap-2 w-full">
                                            <h2 className="text-lg font-semibold p-2">
                                                Passcode
                                            </h2>
                                            <Input
                                                className="placeholder-black font-semibold p-2 bg-slate-200 text-secondary-foreground rounded-sm w-full"
                                                placeholder={user?.mfaSecret}
                                                disabled
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-4">
                                <Button
                                    className="py-2 px-4 bg-amber-600 hover:bg-amber-700"
                                    size="lg"
                                    onClick={(e) => handleResetPassword(e)}
                                >
                                    <KeyRound />
                                    Reset Password
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-10 hover:bg-slate-100"
                                    onClick={() => {
                                        setData(user)
                                        setIsOpen(true)
                                    }}
                                >
                                    <Pencil />
                                </Button>
                                <Button variant="destructive" className="w-10">
                                    <Trash2 />
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <EditProfileForm isOpen={isOpen} toggle={toggle} data={data} />
        </>
    )
}

export default Profile
