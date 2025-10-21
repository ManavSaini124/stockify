"use client"
import {CountrySelectField} from '@/components/forms/CountrySelectField'
import FooterLink from '@/components/forms/FooterLink'
import InputField from '@/components/forms/InputField'
import SelectField from '@/components/forms/SelectField'
import { Button } from '@/components/ui/button'
import { signUpWithEmail } from '@/lib/actions/auth.actions'
import { INVESTMENT_GOALS, PREFERRED_INDUSTRIES, RISK_TOLERANCE_OPTIONS } from '@/lib/constants'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm, SubmitHandler } from "react-hook-form"
import { toast } from 'sonner'

const SignUpPage = () => {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<SignUpFormData>({
        defaultValues: {
            fullName: '',
            email: '',
            password: '',
            country: 'IN',
            investmentGoals: '',
            riskTolerance: 'Medium',
            preferredIndustry: 'Technology',
        },
        mode: 'onBlur'
    })

    const onSubmit= async(data:SignUpFormData) => {
        try{
            // Call your sign-up API
            const result = await signUpWithEmail(data);
            if(result.success){
                router.push('/');
            }
        }catch(err){
            console.error(err);
            toast.error("Sign-up failed. Please try again.",{
                description: err instanceof Error ? err.message : "Failed to sign up. Please try again."
            });
        }
    }

    // split page into two sections: left for form, right for image
    return (
        <>
            <h1 className='form-title'>Sign Up</h1>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
                {/* {form fields} */}
                <InputField 
                    name="fullName"
                    label="Full Name"
                    placeholder="Enter your full name"
                    register={register}
                    error={errors.fullName}
                    validation={{ required: "Full name is required" , minLength: 2 }}
                />
                <InputField 
                    name="email"
                    label="Email"
                    placeholder="abcde@gmail.com"
                    register={register}
                    error={errors.email}
                    validation={{ required: "Email is required" , pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i , message: "Invalid email address"}}
                />
                <CountrySelectField
                    name="country"
                    label="Country"
                    control={control}
                    error={errors.country}
                    required
                />
                <InputField 
                    name="password"
                    label="Password"
                    placeholder="At least 8 characters"
                    type='password'
                    register={register}
                    error={errors.password}
                    validation={{ required: "Password is required" , minLength: 8 }}
                />
                
                <SelectField
                    name="investmentGoals"
                    label="Investment Goals"
                    placeholder="Select your investment goals"
                    options={INVESTMENT_GOALS}
                    control={control}
                    error={errors.investmentGoals}
                    required
                />
                <SelectField
                    name="riskTolerance"
                    label="Risk Tolerance"
                    placeholder="What's your risk tolerance?"
                    options={RISK_TOLERANCE_OPTIONS}
                    control={control}
                    error={errors.riskTolerance}
                    required
                />
                <SelectField
                    name="preferredIndustry"
                    label="Preferred Industry"
                    placeholder="Select your preferred industry"
                    options={PREFERRED_INDUSTRIES}
                    control={control}
                    error={errors.preferredIndustry}
                    required
                />

                <Button type="submit" disabled={isSubmitting} className='yellow-btn w-full mt-5'>
                    {isSubmitting ? 'Signing Up...' : 'Start Investing'}
                </Button>

                <FooterLink 
                    text="Already have an account?"
                    linkText="Sign In"
                    href="/sign-in"
                />
            </form>
        </>
    )
}

export default SignUpPage;