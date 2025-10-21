"use client"
import FooterLink from '@/components/forms/FooterLink'
import InputField from '@/components/forms/InputField'
import { Button } from '@/components/ui/button'
import { signIn } from '@/lib/actions/auth.actions'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm, SubmitHandler } from "react-hook-form"
import { toast } from 'sonner'



const SignInPage = () => {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<SignInFormData>({
        defaultValues: {
            email: '',
            password: '',
        },
        mode: 'onBlur'
    })

    const onSubmit= async(data:SignInFormData) => {
        try{
            const result = await signIn(data);
            if(result.success){
                router.push('/');
            }
        }catch(err){
            console.error(err);
            toast.error("Sign-in failed. Please try again.");
        }
    }

    // split page into two sections: left for form, right for image
    return (
        <>
            <h1 className='form-title'>Sign In</h1>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>

                <InputField 
                    name = "email"
                    label = "Email"
                    placeholder = "Enter your email"
                    register={register}
                    error={errors.email}
                    validation={{ required: "Email is required" , pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i , message: "Invalid email address"}}
                />

                <InputField 
                    name = "password"
                    label = "Password"
                    placeholder = "Enter your Password"
                    register={register}
                    type="password"
                    error={errors.password}
                    validation={{ required: "Password is required" , minLength: 8}}
                />
                

                <Button type="submit" disabled={isSubmitting} className='yellow-btn w-full mt-5'>
                    {isSubmitting ? 'Signing In...' : 'Sign In'}
                </Button>

                <FooterLink text="Don't have an account?" linkText="Create an account" href="/sign-up" />
            </form>


        </>
    )
}

export default SignInPage;