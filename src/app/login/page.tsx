"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();

  // If they’re already signed in, send them home
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) router.replace("/");
    });
    return unsub;
  }, [router]);

  const handleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      const u = auth.currentUser!;
      const userRef = doc(db, "users", u.uid);
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        await setDoc(userRef, { level: 1, xp: 0 });
      }
      router.replace("/");   // go back home
    } catch (err) {
      console.error("Google sign-in failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
        <main className="flex flex-col items-center justify-between mx-4 p-8 space-y-6 bg-[#fff8ee] rounded-3xl shadow-lg">
            <img
            src="/landing-page-image.svg"
            alt="CheatFlow Logo"
            className="h-24 w-24 rounded-full mb-4"
            style={{ filter: "drop-shadow(0 0 5px #ff9d7d)" }}
            />
            <h1 className="text-3xl font-bold">CheatFlow</h1>
            <h1 className="text-2xl font-semibold">Welcome back!</h1>
            <p>Please sign in with Google to access your habits.</p>
            <Button onClick={handleSignIn}>Sign in with Google</Button>
        </main>
        </div>

  );
}
