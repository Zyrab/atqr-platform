"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, QrCode, Search, SlidersHorizontal, ArrowUpDown, Filter } from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Custom Components & Hooks
import DashboardItem from "./qr-item";
import { useQR } from "@/context/qr-context";
import { Card } from "@/components/ui/card";
import Section from "@/components/layout/section";
import { HeaderGroup } from "@/components/elements/heading-group";

export default function DashboardGrid() {
  const router = useRouter();
  const { qrCodes, deleteQr, loading } = useQR();

  // --- Local State ---
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name">("newest");
  const [filterType, setFilterType] = useState<"all" | "url" | "wifi">("all");

  // --- Mock Plan Limits (Replace with real subscription logic later) ---
  const MAX_FREE_QRS = 10;
  const usedCount = qrCodes.length;
  const usagePercentage = Math.min((usedCount / MAX_FREE_QRS) * 100, 100);
  const isLimitReached = usedCount >= MAX_FREE_QRS;

  // --- Filtering & Sorting Logic ---
  const filteredItems = useMemo(() => {
    let items = [...qrCodes];

    // 1. Filter by Search
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      items = items.filter(
        (item) => item.name.toLowerCase().includes(lower) || item.content.url?.toLowerCase().includes(lower),
      );
    }

    // 2. Filter by Type
    if (filterType !== "all") {
      items = items.filter((item) => item.type === filterType);
    }

    // 3. Sort
    items.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return items;
  }, [qrCodes, searchTerm, sortBy, filterType]);

  // --- Handlers ---
  const handleCreateNew = () => {
    if (isLimitReached) {
      alert("Free limit reached! Please upgrade to create more.");
      return;
    }
    router.push("/generator");
  };

  const handleEdit = (id: string) => {
    router.push(`/generator?id=${id}`);
  };

  const handleDuplicate = (item: any) => {
    // Duplicate logic would go here (likely calling a context function)
    console.log("Duplicate", item);
  };

  return (
    <Section>
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col gap-4 w-full max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">My QR Codes</h1>
            <p className="text-muted-foreground text-sm">Manage your saved QR codes.</p>
          </div>

          <div className="flex items-center gap-2">
            <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
              <SelectTrigger className="w-35 h-10">
                <ArrowUpDown className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handleCreateNew} disabled={isLimitReached} size="sm">
              <Plus className="w-5 h-5 md:mr-2" />
              <span className="hidden md:inline">Create New</span>
            </Button>
          </div>
        </div>
        <Card size="sm" width="auto">
          <div className="flex justify-between items-center mb-2 text-sm">
            <span className="font-medium flex items-center gap-2">
              {isLimitReached ? "Static QR code limit reached" : "Static QR codes used"}
            </span>
            <span className="text-muted-foreground">
              {usedCount} / {MAX_FREE_QRS} QR Codes
            </span>
          </div>
          <Progress value={usagePercentage} className="h-2" />
        </Card>
      </div>

      {/* --- CONTENT SECTION --- */}

      <div className="flex flex-col gap-8 w-full max-w-5xl">
        {loading ? (
          <div className="animate-pulse flex flex-col gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-45 bg-muted/20 rounded-xl border border-border" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          // --- EMPTY STATE ---
          <Card width="auto" className="border-2 border-dashed items-center">
            <QrCode className="w-15 h-15 text-muted-foreground" />
            <HeaderGroup
              tag="h2"
              header="No saved QR codes yet"
              subheading="Save up to 10 static QR codes here once you create them."
            >
              <Button onClick={handleCreateNew}>
                <Plus />
                Create QR Code
              </Button>
            </HeaderGroup>
          </Card>
        ) : (
          <>
            {filteredItems.map((item) => (
              <div key={item.id}>
                <DashboardItem item={item} onEdit={handleEdit} onDelete={deleteQr} onDuplicate={handleDuplicate} />
              </div>
            ))}
          </>
        )}
      </div>
    </Section>
  );
}
