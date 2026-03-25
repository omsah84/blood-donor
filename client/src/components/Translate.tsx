"use client";
import { useEffect, useState } from "react";

interface TranslateProps {
  text: string;
}

// This component automatically translates text to Hindi
export function Translate({ text }: TranslateProps) {
  const [hiText, setHiText] = useState(text);

  useEffect(() => {
    fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    })
      .then(res => res.json())
      .then(data => setHiText(data.translated))
      .catch(() => setHiText(text)); // fallback in case of error
  }, [text]);

  return <>{hiText}</>;
}