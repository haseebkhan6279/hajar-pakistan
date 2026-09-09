import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { api } from "../lib/api";
import {
  formatNumber,
  formatPrice,
  type AdminOrder,
  type AdminProduct,
} from "../lib/data";
import { StatCard } from "../components/StatCard";
import { CATEGORICAL, SERIES_GOLD, baseOptions } from "../lib/charts";

const RANGES = [
  { days: 7, label: "7 days" },
  { days: 30, label: "30 days" },
  { days: 90, label: "90 days" },
];

function dayKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function AnalyticsPage() {
  const [days, setDays] = useState(30);
  const [showTable, setShowTable] = useState(false);

  const orders = useQuery({
    queryKey: ["orders"],
    queryFn: async () => (await api.get<AdminOrder[]>("/orders")).data,
  });
  const products = useQuery({
    queryKey: ["products"],
    queryFn: async () => (await api.get<AdminProduct[]>("/products")).data,
  });

  const rows = useMemo(() => orders.data ?? [], [orders.data]);
  const catalogue = products.data ?? [];

  const since = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - (days - 1));
    return d;
  }, [days]);

  const inRange = useMemo(
    () => rows.filter((o) => new Date(o.createdAt) >= since),
    [rows, since]
  );

  /** Revenue per day across the selected window, zero-filled. */
  const daily = useMemo(() => {
    const buckets = new Map<string, { revenue: number; count: number }>();
    for (let i = 0; i < days; i++) {
      const d = new Date(since);
      d.setDate(d.getDate() + i);
      buckets.set(dayKey(d), { revenue: 0, count: 0 });
    }
    for (const o of inRange) {
      if (o.status === "cancelled") continue;
      const key = dayKey(new Date(o.createdAt));
      const slot = buckets.get(key);
      if (!slot) continue;
      slot.revenue += o.total;
      slot.count += 1;
    }
    return [...buckets.entries()].map(([date, v]) => ({ date, ...v }));
  }, [inRange, days, since]);

  /** Units sold per collection — categorical, coloured by entity. */
  const byCollection = useMemo(() => {
    const slugOf = new Map(catalogue.map((p) => [p.slug, p.category]));
    const totals = new Map<string, number>();
    for (const o of inRange) {
      if (o.status === "cancelled") continue;
      for (const item of o.items) {
        const collection = slugOf.get(item.slug) ?? "Other";
        totals.set(
          collection,
          (totals.get(collection) ?? 0) + item.price * item.qty
        );
      }
    }
    return [...totals.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, value]) => ({ name, value }));
  }, [inRange, catalogue]);

  /** Bookings by fulfilment stage. */
  const byStatus = useMemo(() => {
    const totals = new Map<string, number>();
    for (const o of inRange) {
      totals.set(o.status, (totals.get(o.status) ?? 0) + 1);
    }
    return [...totals.entries()];
  }, [inRange]);

  const revenue = daily.reduce((n, d) => n + d.revenue, 0);
  const orderCount = daily.reduce((n, d) => n + d.count, 0);
  const units = inRange
    .filter((o) => o.status !== "cancelled")
    .reduce((n, o) => n + o.items.reduce((m, i) => m + i.qty, 0), 0);
  const aov = orderCount ? Math.round(revenue / orderCount) : 0;

  const trendOptions: ApexOptions = {
    ...baseOptions(),
    chart: { ...baseOptions().chart, type: "area" },
    colors: [SERIES_GOLD],
    stroke: { curve: "smooth", width: 2 },
    fill: {
      type: "gradient",
      gradient: { opacityFrom: 0.24, opacityTo: 0.02, shadeIntensity: 0.3 },
    },
    markers: { size: 0, hover: { size: 6 } },
    xaxis: {
      ...baseOptions().xaxis,
      categories: daily.map((d) =>
        new Date(d.date).toLocaleDateString("en-PK", {
          day: "numeric",
          month: "short",
        })
      ),
      tickAmount: 6,
    },
    yaxis: {
      ...baseOptions().yaxis,
      labels: {
        style: { colors: "#7C7466", fontSize: "11px" },
        formatter: (v: number) =>
          v >= 1000 ? `${Math.round(v / 1000)}k` : String(Math.round(v)),
      },
    },
    tooltip: {
      ...baseOptions().tooltip,
      y: { formatter: (v: number) => formatPrice(v) },
    },
  };

  const collectionOptions: ApexOptions = {
    ...baseOptions(),
    chart: { ...baseOptions().chart, type: "bar" },
    colors: CATEGORICAL,
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "56%",
        borderRadius: 4,
        borderRadiusApplication: "end",
        distributed: true,
      },
    },
    legend: { ...baseOptions().legend, show: byCollection.length > 1 },
    xaxis: {
      ...baseOptions().xaxis,
      categories: byCollection.map((c) => c.name),
      labels: {
        style: { colors: "#7C7466", fontSize: "11px" },
        formatter: (v: string) =>
          Number(v) >= 1000 ? `${Math.round(Number(v) / 1000)}k` : v,
      },
    },
    tooltip: {
      ...baseOptions().tooltip,
      y: { formatter: (v: number) => formatPrice(v) },
    },
  };

  const statusOptions: ApexOptions = {
    ...baseOptions(),
    chart: { ...baseOptions().chart, type: "bar" },
    colors: [SERIES_GOLD],
    plotOptions: {
      bar: {
        columnWidth: "42%",
        borderRadius: 4,
        borderRadiusApplication: "end",
      },
    },
    xaxis: {
      ...baseOptions().xaxis,
      categories: byStatus.map(([s]) => s),
    },
    tooltip: {
      ...baseOptions().tooltip,
      y: { formatter: (v: number) => `${v} orders` },
    },
  };

  const loading = orders.isLoading || products.isLoading;
  const hasData = inRange.length > 0;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-hj-muted">
            Insight
          </p>
          <h1 className="mt-2 font-display text-4xl text-hj-ink">Analytics</h1>
          <div className="rule-gold mt-3 h-px w-20" />
          <p className="mt-3 text-sm text-hj-muted">
            Built from live orders · cancelled bookings excluded from revenue
          </p>
        </div>

        <div className="flex gap-1 rounded-sm border border-hj-border bg-white p-1">
          {RANGES.map((r) => (
            <button
              key={r.days}
              type="button"
              onClick={() => setDays(r.days)}
              className={`h-9 rounded-sm px-4 text-[11px] uppercase tracking-[0.12em] transition-colors ${
                days === r.days
                  ? "bg-hj-ink text-hj-gold-soft"
                  : "text-hj-muted hover:text-hj-ink"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Revenue"
          value={formatPrice(revenue)}
          hint={`Last ${days} days`}
          tone="gold"
        />
        <StatCard
          label="Orders"
          value={formatNumber(orderCount)}
          hint={`${formatNumber(units)} pieces`}
        />
        <StatCard label="Average order" value={formatPrice(aov)} />
        <StatCard
          label="Live pieces"
          value={String(
            catalogue.filter((p) => p.status === "published").length
          )}
          hint={`${catalogue.length} in catalogue`}
        />
      </div>

      <section className="mt-6 rounded-sm border border-hj-border bg-white p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <h2 className="font-display text-xl text-hj-ink">
              Revenue per day
            </h2>
            <p className="mt-1 text-xs text-hj-muted">
              PKR booked, cash on delivery
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowTable((v) => !v)}
            className="text-[11px] uppercase tracking-[0.12em] text-hj-gold-deep hover:underline"
          >
            {showTable ? "Hide table" : "View as table"}
          </button>
        </div>

        {loading ? (
          <p className="py-16 text-center text-sm text-hj-muted">Loading…</p>
        ) : (
          <div className="mt-4">
            <Chart
              options={trendOptions}
              series={[{ name: "Revenue", data: daily.map((d) => d.revenue) }]}
              type="area"
              height={280}
            />
          </div>
        )}

        {showTable && (
          <div className="mt-4 max-h-64 overflow-y-auto rounded-sm border border-hj-border">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-hj-cream text-[10px] uppercase tracking-[0.14em] text-hj-muted">
                <tr>
                  <th className="px-3 py-2.5 font-medium">Date</th>
                  <th className="px-3 py-2.5 font-medium">Orders</th>
                  <th className="px-3 py-2.5 font-medium">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hj-border">
                {daily.map((d) => (
                  <tr key={d.date}>
                    <td className="px-3 py-2 font-mono text-xs text-hj-muted">
                      {d.date}
                    </td>
                    <td className="px-3 py-2">{d.count}</td>
                    <td className="px-3 py-2">{formatPrice(d.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-sm border border-hj-border bg-white p-5">
          <h2 className="font-display text-xl text-hj-ink">
            Revenue by collection
          </h2>
          <p className="mt-1 text-xs text-hj-muted">
            Where demand is concentrated
          </p>
          {byCollection.length > 0 ? (
            <div className="mt-4">
              <Chart
                options={collectionOptions}
                series={[
                  { name: "Revenue", data: byCollection.map((c) => c.value) },
                ]}
                type="bar"
                height={Math.max(200, byCollection.length * 52)}
              />
            </div>
          ) : (
            <p className="py-16 text-center text-sm text-hj-muted">
              No sales in this window yet.
            </p>
          )}
        </section>

        <section className="rounded-sm border border-hj-border bg-white p-5">
          <h2 className="font-display text-xl text-hj-ink">
            Bookings by stage
          </h2>
          <p className="mt-1 text-xs text-hj-muted">
            Where orders sit in fulfilment
          </p>
          {byStatus.length > 0 ? (
            <div className="mt-4">
              <Chart
                options={statusOptions}
                series={[{ name: "Orders", data: byStatus.map(([, n]) => n) }]}
                type="bar"
                height={280}
              />
            </div>
          ) : (
            <p className="py-16 text-center text-sm text-hj-muted">
              No orders in this window yet.
            </p>
          )}
        </section>
      </div>

      {!loading && !hasData && (
        <p className="mt-6 rounded-sm border border-hj-border bg-white px-5 py-4 text-sm text-hj-muted">
          Nothing has been ordered in the last {days} days. Widen the range, or
          place a test order from the storefront to see this fill in.
        </p>
      )}
    </div>
  );
}
