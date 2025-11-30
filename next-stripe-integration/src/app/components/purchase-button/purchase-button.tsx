"use client";

import { getStripe } from "@/app/lib/stripe-client";
import { useState } from "react";
import purchase from "./purchase";

export const PurchaseButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    setIsLoading(true);
    const res = await purchase();
  
    if (!res.checkoutSessionId) {
      console.error("Failed to create Stripe Checkout session.");
      setIsLoading(false);
      return;
    }
  
    const stripe = await getStripe();

    if (!stripe) {
      console.error("Failed to load Stripe");
      setIsLoading(false);
      return;
    }

    // Redirect to Stripe Checkout using the session ID
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: res.checkoutSessionId }),
    });

    if (!response.ok) {
      console.error("Failed to get checkout URL");
      setIsLoading(false);
      return;
    }

    const { url } = await response.json();
    if (url) {
      window.location.href = url;
    }

    setIsLoading(false);
  };

  return (
    <button
      onClick={onSubmit}
      disabled={isLoading}
      className="bg-blue-500 px-4 py-2 text-white"
    >
      {isLoading ? "Loading..." : "Purchase"}
    </button>
  );
};