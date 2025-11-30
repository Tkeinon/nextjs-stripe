"use server";

import { stripeAPI } from "@/app/lib/stripe-server";

export default async function purchase() {
    try {
        const priceId = process.env.STRIPE_PRICE_ID;

        const stripeCheckoutSession = await stripeAPI.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                price: priceId,
                quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${process.env.BASE_URL}/?checkout=success`,
            cancel_url: `${process.env.BASE_URL}/?checkout=cancelled`,
            metadata: {},
        });
        console.log(stripeCheckoutSession)
        return { checkoutSessionId: stripeCheckoutSession.id };
    } catch (e) {
        console.log(e);
        return {
            checkoutSessionId: null
        };
    }
}