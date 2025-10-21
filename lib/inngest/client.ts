import { Inngest } from "inngest";

export const inngest = new Inngest({ 
    id: "stockify",
    ai: {
        gemini:{
            apiKey: process.env.GOOGLE_API_KEY
        }
    }
});