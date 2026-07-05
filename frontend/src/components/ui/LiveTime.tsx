"use client";
import { useEffect, useState } from "react";

export default function LiveTime({ prefix = "Updated" }: { prefix?: string }) {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    setTime(new Date().toLocaleTimeString());
    const interval = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) return null;
  return <>{prefix} {time}</>;
}
