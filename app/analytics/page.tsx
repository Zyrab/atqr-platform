"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Loader2, QrCode, MousePointerClick, Clock, ArrowUpDown } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis, Pie, PieChart, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

import { useSearchParams } from "next/navigation";
import { useSafeAction } from "@/hooks/use-safe-action";
import { services } from "@/lib/firebase/services";
import { Card } from "@/components/ui/card";
import { HeaderGroup } from "@/components/elements/heading-group";
import { useQR } from "@/context/qr-context";
import { useAuth } from "@/context/auth-context";
import { QRStat } from "@/types/qr";
import Section from "@/components/layout/section";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ChartContainer = ({ children, className = "" }: any) => (
  <div className={className}>
    <ResponsiveContainer width="100%" height="100%">
      {children}
    </ResponsiveContainer>
  </div>
);

const ChartTooltip = Tooltip;
const ChartTooltipContent = ({ active, payload, hideLabel }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover text-popover-foreground border border-border p-2 rounded-md shadow-sm text-sm font-medium">
        {!hideLabel && (payload[0].name || payload[0].payload.country)}
        {!hideLabel && ": "}
        {payload[0].value}
      </div>
    );
  }
  return null;
};

// Map directly to your Tailwind CSS variables defined in your global CSS
const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

export default function AnalyticsPage() {
  const { user, loading: authLoading } = useAuth();
  const { qrCodes, loading: initialLoading } = useQR();
  const { runAction, loading: fetchingStats } = useSafeAction();

  const searchParams = useSearchParams();
  const slugParam = searchParams.get("slug");
  const idParam = searchParams.get("id");

  const [selectedSlug, setSelectedSlug] = useState<string>("");
  const [stats, setStats] = useState<QRStat | null>(null);

  const dynamicQRs = useMemo(() => {
    return qrCodes.filter((qr) => qr.type === "dynamic");
  }, [qrCodes]);

  // Set the initial QR code based on URL parameters or default to the first one
  useEffect(() => {
    if (!initialLoading && dynamicQRs.length > 0 && !selectedSlug) {
      const matchedQR = dynamicQRs.find((qr) => qr.slug === slugParam || qr.id === idParam);

      if (matchedQR && matchedQR.slug) {
        setSelectedSlug(matchedQR.slug);
      } else {
        setSelectedSlug(dynamicQRs[0].slug!);
      }
    }
  }, [initialLoading, dynamicQRs, slugParam, idParam, selectedSlug]);

  // Fetch stats whenever the selected slug changes
  useEffect(() => {
    if (!selectedSlug) return;

    runAction(
      async () => {
        const data = await services.qr.fetchStat(selectedSlug);
        setStats(data as QRStat);
      },
      {
        requireAuth: true,
        onError: () => setStats(null), // Clear stats if it fails
      },
    );
  }, [selectedSlug]); // eslint-disable-line react-hooks/exhaustive-deps

  const osData = useMemo(() => {
    if (!stats?.os) return [];
    return Object.entries(stats.os)
      .map(([name, value], index) => ({
        name,
        value: value as number,
        // The Pie chart will automatically use this 'fill' property. No <Cell /> needed!
        fill: COLORS[index % COLORS.length],
      }))
      .sort((a, b) => b.value - a.value); // Highest first
  }, [stats]);

  const countryData = useMemo(() => {
    if (!stats?.countries) return [];
    return Object.entries(stats.countries)
      .map(([country, value]) => ({
        country,
        value: value as number,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Just show the top 5 countries
  }, [stats]);

  // Handle Loading & Auth States
  if (authLoading || initialLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-64 flex-col items-center justify-center space-y-4 text-center">
        <h2 className="text-xl font-semibold">Sign in required</h2>
        <p className="text-muted-foreground">Please log in to view your analytics.</p>
      </div>
    );
  }

  if (dynamicQRs.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center space-y-4 text-center">
        <QrCode className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold">No Dynamic QR Codes found</h2>
        <p className="text-muted-foreground">Create a dynamic QR code to see analytics here.</p>
      </div>
    );
  }

  return (
    <Section>
      {/* Header & Dropdown */}
      <div className="flex flex-col sm:flex-row w-full max-w-4xl justify-between items-start sm:items-center gap-4">
        <HeaderGroup
          className="items-start mb-0"
          header="Analytics"
          subheading="View scan statistics for your dynamic QR codes."
        />

        <Select value={selectedSlug} onValueChange={setSelectedSlug}>
          <SelectTrigger className="w-35 h-10">
            <QrCode className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {dynamicQRs.map((qr) => (
              <SelectItem key={qr.id} value={qr.slug!}>
                {qr.name || "Untitled QR"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {fetchingStats ? (
        <div className="flex h-64 w-full max-w-4xl items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !stats ? (
        <Card className="flex h-32 w-full max-w-4xl items-center justify-center text-muted-foreground">
          No data available for this QR code yet.
        </Card>
      ) : (
        <>
          {/* Top Summary Cards */}
          <div className="flex flex-col sm:flex-row w-full max-w-4xl justify-between gap-4">
            <Card width="full" className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <HeaderGroup tag="h3" header="Total Scans" size="sm" />
                <MousePointerClick className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-4xl font-bold">{stats.scans}</div>
            </Card>

            <Card width="full" className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <HeaderGroup tag="h3" header="Last Scanned" size="sm" />
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">
                {stats.lastScannedAt
                  ? new Date((stats.lastScannedAt as any).toDate?.() || stats.lastScannedAt).toLocaleDateString(
                      undefined,
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )
                  : "Never"}
              </div>
            </Card>
          </div>

          {/* Charts Grid */}
          <div className="flex flex-col md:flex-row w-full max-w-4xl justify-between gap-4">
            {/* Devices / OS Chart */}
            <Card width="full" className="flex-1">
              <HeaderGroup
                tag="h3"
                header="Operating Systems"
                subheading="Devices used to scan"
                size="sm"
                className="items-start"
              />
              <ChartContainer config={{ value: { label: "Scans" } }} className="mx-auto aspect-square h-75 w-full mt-4">
                <PieChart>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <Pie
                    data={osData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    strokeWidth={5}
                    stroke="var(--card)"
                  />
                </PieChart>
              </ChartContainer>
            </Card>

            {/* Countries Bar Chart */}
            <Card width="full" className="flex-1">
              <HeaderGroup
                tag="h3"
                header="Top Countries"
                subheading="Scans by location"
                size="sm"
                className="items-start"
              />
              <ChartContainer
                config={{ value: { label: "Scans", color: "var(--chart-1)" } }}
                className="aspect-auto h-75 w-full mt-4"
              >
                <BarChart data={countryData} layout="horizontal" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <XAxis dataKey="country" type="category" tickLine={false} axisLine={true} height={40} />
                  <YAxis type="number" hide />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill={COLORS[0]} radius={[4, 4, 0, 0]} barSize={32} />
                  <CartesianGrid stroke="var(--border)" strokeOpacity={0.2} />
                </BarChart>
              </ChartContainer>
            </Card>
          </div>
        </>
      )}
    </Section>
  );
}
