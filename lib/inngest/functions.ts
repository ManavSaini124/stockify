
import { inngest } from "./client";
import { NEWS_SUMMARY_EMAIL_PROMPT, PERSONALIZED_WELCOME_EMAIL_PROMPT } from "./prompt";
import { sendNewsSummaryEmail, sendWelcomeEmail } from "../nodeMailer";
import { getAllUsersForNewsDelivery } from "../actions/user.action";
import { getNews } from "../actions/finnhub.actions";
import { getWatchlistSymbolsByEmail } from "../actions/watchlist.action";

type UserForNewsEmail = {
  id: string;
  email: string;
  name: string;
};

export const sendSignUpEmail = inngest.createFunction(
    { id: "send-signup-email" },
    { event: "app/user.created" },
    async ({ event, step }) => {
        const userProfile = `
        - Country: ${event.data.country}
        - Investment Goals: ${event.data.investmentGoals}
        - Risk Tolerance: ${event.data.riskTolerance}
        - Preferred Industry: ${event.data.preferredIndustry}
        `

        const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace("{{userProfile}}", userProfile);

        const response = await step.ai.infer('genrate-welcome-intro',{
            model: step.ai.models.gemini({
                model: "gemini-2.5-flash-lite"
            }),
            body:{
                contents: [
                    {
                        role: "user",
                        parts:[
                            { text: prompt }
                        ]
                    }
                ]
            }  
        });
    
        await step.run("send-email", async()=>{
            const part = response.candidates?.[0]?.content?.parts?.[0];
            const introText = (part && 'text' in part ? part.text : null ) || "Welcome to Stockify! We’re thrilled to have you on board and excited for you to start exploring smarter ways to invest, track markets, and grow your portfolio.";

            const { email, name } = event.data;
            // EMAIL SENDING LOGIC HERE
            return await sendWelcomeEmail({
                email,
                name,
                intro: introText
            })
        })

        return {
            success: true,
            message: "Personalized welcome email sent."
        }
    }
)

export const sendDailyNewsSummary = inngest.createFunction(
    { id: "send-daily-news-summary" },
    [{ event: "app/send.daily.news" },{cron:"TZ=Asia/Kolkata 0 7 * * *"}], // Every day at 12 AM
    async ({ event, step }) => {
        const users = await step.run("fetch-users", getAllUsersForNewsDelivery);

        if(!users || users.length === 0){
            return {
                success: false,
                message: "No users found for news delivery."
            }
        }
   
        const results = await step.run('fetch-user-news', async () => {
            const perUser: Array<{ user: UserForNewsEmail; articles: MarketNewsArticle[] }> = [];
            for (const user of users as UserForNewsEmail[]) {
                try {
                    const symbols = await getWatchlistSymbolsByEmail(user.email);
                    let articles = await getNews(symbols);
                    // Enforce max 6 articles per user
                    articles = (articles || []).slice(0, 6);
                    // If still empty, fallback to general
                    if (!articles || articles.length === 0) {
                        articles = await getNews();
                        articles = (articles || []).slice(0, 6);
                    }
                    perUser.push({ user, articles });
                } catch (e) {
                    console.error('daily-news: error preparing user news', user.email, e);
                    perUser.push({ user, articles: [] });
                }
            }
            return perUser;
        });

        const userNewsSummary: {user: User; newsContent: string | null}[] = [];

        for(const {user, articles} of results ){
            try{
                const prompt = NEWS_SUMMARY_EMAIL_PROMPT.replace("{{newsData}}", JSON.stringify(articles, null, 2));
                const response = await step.ai.infer('generate-news-summary',{
                    model: step.ai.models.gemini({
                        model: "gemini-2.5-flash-lite"
                    }),
                    body:{
                        contents: [
                            {
                                role: "user",
                                parts:[
                                    { text: prompt }
                                ]
                            }
                        ]
                    }  
                });
                const part = response.candidates?.[0]?.content?.parts?.[0];
                const newsContent = (part && 'text' in part ? part.text : null ) || "Here is your daily stock market news summary. ";
                userNewsSummary.push({user, newsContent});
            }catch(e){
                console.error('daily-news: error formatting news for', user.email, e);
                userNewsSummary.push({user, newsContent: null});
            }
        }

        // Send Emails
        await step.run("send-emails", async()=>{
            await Promise.all(
                userNewsSummary.map(async({user, newsContent})=>{
                    if(!newsContent) return false;
                    return await sendNewsSummaryEmail({
                        email: user.email,
                        date: new Date().toLocaleDateString(),
                        newsContent
                    })
                })
            )
        })

        return {
            success: true,
            message: "Daily news summary emails sent."
        }

    }
)