"use client";

import { useEffect, useState } from "react";
import Dashboard from "@/components/views/Dashboard/dashboard";
import SplashScreen from "@/app/loading";

export default function Home() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return loading ? <SplashScreen onFinish={() => {}} /> : <Dashboard />;
}