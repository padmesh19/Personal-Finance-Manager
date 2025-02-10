import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/datepicker'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import userServices from '@/services/userService'
import { Switch } from '@/components/ui/switch'

export default function EditProfileForm({ isOpen, toggle, data }) {
    const dispatch = useDispatch()
    const [profileData, setProfileData] = useState({
        name: data?.name || '',
        email: data?.email || '',
        currency: data?.currency || '',
        mfaEnabled: data?.mfaEnabled || false,
        mfaSecret: data?.mfaSecret || '',
    })

    useEffect(() => {
        if (data) {
            setProfileData({
                name: data?.name || '',
                email: data?.email || '',
                currency: data?.currency || '',
                mfaEnabled: data?.mfaEnabled || false,
                mfaSecret: data?.mfaSecret || '',
            })
        }
    }, [data])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (profileData?.mfaEnabled === false) {
            setProfileData((state) => ({
                ...state,
                mfaSecret: '',
            }))
        }
        const response = await userServices.updateProfile(profileData)
        if (response.status == 200) {
            toggle()
            toast.success('Profile updated successfully')
        }
    }

    const inputData = (key, value) => {
        setProfileData((state) => ({ ...state, [key]: value }))
    }

    return (
        <Dialog open={isOpen}>
            <DialogContent className="sm:max-w-[425px] max-w-[95vw] md:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Edit Profile Details</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click{' '}
                        <span className="font-bold">Save</span> button when
                        you're done.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            type="text"
                            value={profileData?.name}
                            onChange={(e) => {
                                inputData('name', e.target.value)
                            }}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="text"
                            value={profileData?.email}
                            onChange={(e) => {
                                inputData('email', e.target.value)
                            }}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid w-full grid-cols-4 items-center gap-4">
                        <Label htmlFor="currency" className="text-right">
                            Currency
                        </Label>
                        <Input
                            id="currency"
                            type="text"
                            value={profileData?.currency}
                            onChange={(e) => {
                                inputData('currency', e.target.value)
                            }}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid w-full grid-cols-4 items-center gap-4">
                        <Label htmlFor="mfaEnabled" className="text-right">
                            MFA
                        </Label>
                        <Switch
                            id="mfaEnabled"
                            checked={profileData?.mfaEnabled}
                            onClick={(e) => {
                                inputData('mfaEnabled', !profileData.mfaEnabled)
                            }}
                        />
                    </div>
                    {profileData?.mfaEnabled && (
                        <div className="grid w-full grid-cols-4 items-center gap-4">
                            <Label htmlFor="mfaSecret" className="text-right">
                                Passcode
                            </Label>
                            <Input
                                id="mfaSecret"
                                type="text"
                                value={profileData?.mfaSecret}
                                onChange={(e) => {
                                    inputData('mfaSecret', e.target.value)
                                }}
                                className="col-span-3"
                            />
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button type="submit" variant="outline" onClick={toggle}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="bg-orange-600 hover:bg-orange-700"
                        onClick={(e) => handleSubmit(e)}
                    >
                        Save changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
