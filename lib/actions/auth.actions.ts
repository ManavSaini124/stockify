"use server";

import { headers } from "next/headers";
import { auth } from "../betterAuth/auth";
import { inngest } from "../inngest/client";

export const signUpWithEmail = async ({email, password, fullName, country, investmentGoals, riskTolerance, preferredIndustry}: SignUpFormData) => {
    try{
        // call betterauth
        const response = await auth.api.signUpEmail({
            body: {
                email,
                password,
                name: fullName,
            },
        })

        if(response){
            await inngest.send({
                name: "app/user.created",
                data: {
                    email,
                    name: fullName,
                    country,
                    investmentGoals,
                    riskTolerance,
                    preferredIndustry
                }
            })
        }
        return { success: true, data: response };
    }catch(err){
        console.log("Sign-up failed")
        console.error(err);
        return { success: false, error: "Sign-up failed. Please try again." };
    }
}

export const signIn = async ({email, password}: SignInFormData) => {
    try{
        // call betterauth
        const response = await auth.api.signInEmail({
            body: {
                email,
                password,  
            }
        })
        return { success: true, data: response };
    }
    catch(err){
        console.log("Sign-in failed")
        console.error(err);
        return { success: false, error: "Sign-in failed. Please try again." };
    }
}

export const signOut = async()=>{
    try{
        await auth.api.signOut({
            headers: await headers()
        });
    }catch(err){
        console.log("Sign-out failed")
        console.error(err);
        return { success: false, error: "Sign-out failed. Please try again." };
    }
}
