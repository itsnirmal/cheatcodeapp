"use client";

import { useState, useEffect } from "react";
import type { User } from "firebase/auth";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
  doc,
  runTransaction,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

import { Plus, Check, Clock, X, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

type HabitStatus = "Not Activated" | "In Progress" | "Activated";

interface Habit {
  id: string;
  name: string;
  streak: number;
  status: HabitStatus;
  createdAt: Date;
}

interface Props {
  user: User;
  profile: { level: number; xp: number };
}

export default function HabitTracker({ user, profile }: Props) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabitName, setNewHabitName] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // subscribe to this user's habits
  useEffect(() => {
    const q = query(collection(db, "habits"), where("userId", "==", user.uid));
    const unsub = onSnapshot(q, (snap) => {
      setHabits(
        snap.docs.map((d) => {
          const data = d.data();
          const raw = data.createdAt as Timestamp | null;
          return {
            id: d.id,
            name: data.name,
            streak: data.streak,
            status: data.status as HabitStatus,
            createdAt: raw?.toDate() ?? new Date(),
          };
        })
      );
    });
    return unsub;
  }, [user]);

  // count how many “slots” are currently used (non-activated habits)
  const usedSlots = habits.filter((h) => h.status !== "Activated").length;

  // helper: award XP & level-up
  const awardXP = async (gain: number) => {
    const userRef = doc(db, "users", user.uid);
    await runTransaction(db, async (tx) => {
      const snap = await tx.get(userRef);
      if (!snap.exists()) return;
      let { xp, level } = snap.data() as { xp: number; level: number };
      xp += gain;
      const needed = level * 150;
      if (xp >= needed) {
        xp -= needed;
        level += 1;
      }
      tx.update(userRef, { xp, level });
    });
  };

  // add a new habit (only if under slot limit)
  const addHabit = async () => {
    if (!newHabitName.trim() || usedSlots >= profile.level) return;
    await addDoc(collection(db, "habits"), {
      userId: user.uid,
      name: newHabitName.trim(),
      streak: 0,
      status: "Not Activated" as HabitStatus,
      createdAt: serverTimestamp(),
    });
    setNewHabitName("");
  };

  // increment streak + award 1 XP
  const incrementStreak = async (id: string) => {
    const h = habits.find((h) => h.id === id);
    if (!h) return;
    const newStreak = h.streak + 1;
    const newStatus: HabitStatus =
      newStreak >= 30
        ? "Activated"
        : newStreak > 0
        ? "In Progress"
        : "Not Activated";
    await updateDoc(doc(db, "habits", id), {
      streak: newStreak,
      status: newStatus,
    });
    await awardXP(10);
  };

  const resetStreak = (id: string) =>
    updateDoc(doc(db, "habits", id), {
      streak: 0,
      status: "Not Activated",
    });

  const deleteHabit = (id: string) => deleteDoc(doc(db, "habits", id));

  const filtered = habits.filter((h) =>
    activeTab === "all"
      ? true
      : h.status.toLowerCase().replace(" ", "-") === activeTab
  );

  const getIcon = (s: HabitStatus) =>
    s === "Activated" ? (
      <Check className="h-5 w-5 text-green-500" />
    ) : s === "In Progress" ? (
      <Clock className="h-5 w-5 text-amber-500" />
    ) : (
      <X className="h-5 w-5 text-red-400" />
    );

  const getColor = (s: HabitStatus) =>
    s === "Activated"
      ? "bg-green-100 text-green-800"
      : s === "In Progress"
      ? "bg-amber-100 text-amber-800"
      : "bg-red-100 text-red-800";

  return (
    <div className="space-y-6">
      <div className="flex gap-2 bg-[#fff8ee] p-4 rounded-xl shadow">
        <Input
          placeholder="Enter a new habit…"
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addHabit()}
          className="flex-1"
        />
        <Button onClick={addHabit} disabled={usedSlots >= profile.level}>
          <Plus className="h-4 w-4 mr-2" /> Add Habit
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="activated">Activated</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="not-activated">Not Activated</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No habits yet</div>
          ) : (
            <div className="grid gap-4">
              {filtered.map((h) => (
                <Card key={h.id} className="bg-[#fff8ee] shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        {getIcon(h.status)}
                        <div>
                          <h3 className="font-medium">{h.name}</h3>
                          <Badge variant="outline" className={getColor(h.status)}>
                            {h.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-center">
                          <div className="text-2xl font-bold">{h.streak}</div>
                          <div className="text-xs text-gray-500">days</div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Filter className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => incrementStreak(h.id)}>
                              Increment streak
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => resetStreak(h.id)}>
                              Reset streak
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => deleteHabit(h.id)}>
                              Delete habit
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
