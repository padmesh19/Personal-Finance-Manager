import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import userServices from '@/services/userService'
import { Switch } from '@/components/ui/switch'
import { setUser } from '@/redux/features/userSlice'

export default function EditProfileForm({ isOpen, toggle, data }) {
    const dispatch = useDispatch()
    const [profileData, setProfileData] = useState({
        name: data?.name || '',
        email: data?.email || '',
        currency: data?.currency || '',
        mfaEnabled: data?.mfaEnabled || false,
        mfaSecret: data?.mfaSecret || '',
    })

    const [errors, setErrors] = useState({
        name: '',
        email: '',
        currency: '',
        mfaSecret: '',
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

    const validateInputs = () => {
        let valid = true
        let newErrors = { name: '', email: '', currency: '', mfaSecret: '' }

        // Name validation
        if (!profileData.name.trim()) {
            newErrors.name = 'Name is required.'
            valid = false
        } else if (profileData.name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters.'
            valid = false
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!profileData.email.trim()) {
            newErrors.email = 'Email is required.'
            valid = false
        } else if (!emailRegex.test(profileData.email)) {
            newErrors.email = 'Enter a valid email address.'
            valid = false
        }

        // Currency validation
        const currencyRegex = /^[A-Z]{3}$/
        if (!profileData.currency.trim()) {
            newErrors.currency = 'Currency is required.'
            valid = false
        } else if (!currencyRegex.test(profileData.currency)) {
            newErrors.currency =
                'Currency must be 3 uppercase letters (e.g., USD).'
            valid = false
        }

        // MFA Secret validation (only if MFA is enabled)
        if (
            profileData.mfaEnabled &&
            (!profileData.mfaSecret || profileData.mfaSecret.length < 6)
        ) {
            newErrors.mfaSecret = 'MFA Passcode must be at least 6 characters.'
            valid = false
        }

        setErrors(newErrors)
        return valid
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateInputs()) return

        try {
            const response = await userServices.updateProfile(profileData)
            if (response.status === 200) {
                dispatch(setUser(response.data))
                toggle()
                toast.success('Profile updated successfully')
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || 'Failed to update profile.'
            )
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
                        <span className="font-bold">Save</span> when you're
                        done.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <div className="col-span-3">
                            <Input
                                id="name"
                                type="text"
                                value={profileData.name}
                                onChange={(e) =>
                                    inputData('name', e.target.value)
                                }
                            />
                            {errors.name && (
                                <span className="text-red-500 text-sm">
                                    {errors.name}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <div className="col-span-3">
                            <Input
                                id="email"
                                type="text"
                                value={profileData.email}
                                onChange={(e) =>
                                    inputData('email', e.target.value)
                                }
                            />
                            {errors.email && (
                                <span className="text-red-500 text-sm">
                                    {errors.email}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="currency" className="text-right">
                            Currency
                        </Label>
                        <div className="col-span-3">
                            <Input
                                id="currency"
                                type="text"
                                value={profileData.currency}
                                onChange={(e) =>
                                    inputData('currency', e.target.value)
                                }
                            />
                            {errors.currency && (
                                <span className="text-red-500 text-sm">
                                    {errors.currency}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="mfaEnabled" className="text-right">
                            MFA
                        </Label>
                        <Switch
                            id="mfaEnabled"
                            checked={profileData.mfaEnabled}
                            onClick={() =>
                                inputData('mfaEnabled', !profileData.mfaEnabled)
                            }
                        />
                    </div>

                    {profileData.mfaEnabled && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="mfaSecret" className="text-right">
                                Passcode
                            </Label>
                            <div className="col-span-3">
                                <Input
                                    id="mfaSecret"
                                    type="text"
                                    value={profileData.mfaSecret}
                                    onChange={(e) =>
                                        inputData('mfaSecret', e.target.value)
                                    }
                                />
                                {errors.mfaSecret && (
                                    <span className="text-red-500 text-sm">
                                        {errors.mfaSecret}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={toggle}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="bg-orange-600 hover:bg-orange-700"
                        onClick={handleSubmit}
                    >
                        Save changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
