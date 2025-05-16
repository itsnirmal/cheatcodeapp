"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import HabitTracker from "@/components/habit-tracker";
import LandingPage from "@/components/landing-page";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<{ level: number; xp: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // listen for auth changes
  useEffect(() => {
    const unsub = onAuthStateChanged(
      auth,
      (u) => {
        setUser(u);
        setIsLoading(false);
      },
      () => setIsLoading(false)
    );
    return unsub;
  }, []);

  // once we have a user, subscribe to their profile doc
  useEffect(() => {
    if (!user) return;
    const ref = doc(db, "users", user.uid);
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) setProfile(snap.data() as any);
    });
    return unsub;
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-12 w-12 border-t-2 border-b-2 rounded-full"></div>
      </div>
    );
  }

  // not signed in → landing
  if (!user) {
    return <LandingPage />;
  }

  // profile still loading
  if (!profile) {
    return <div className="text-center py-10">Loading profile…</div>;
  }

  // compute XP needed until next level
  const threshold = profile.level * 150;
  const needed = Math.max(0, threshold - profile.xp);

  return (
    <main className="container mx-auto p-4 max-w-4xl space-y-6">
      <div className="flex justify-between items-center">
        {/* ← top-left: Level & XP */}
        <div>
          <div className="text-xl font-bold">Level {profile.level}</div>
          <div className="text-sm text-gray-600">
            {profile.xp}/{threshold} XP ({needed} to go)
          </div>
        </div>

        {/* top-right: user + sign-out */}
        <div className="flex items-center gap-3 bg-[#fff8ee] p-3 rounded-xl shadow">
          <span className="font-medium">{user.displayName}</span>
          <Button variant="outline" className="bg-black text-white" onClick={() => signOut(auth)}>
            Sign Out
          </Button>
        </div>
      </div>

      {/* pass both user & profile into HabitTracker */}
      <HabitTracker user={user} profile={profile} />
    </main>
  );
}
