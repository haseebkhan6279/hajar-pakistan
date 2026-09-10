import { useEffect, useState } from "react";
import { api } from "../lib/api";
import {
  ORDER_STATUSES,
  formatDate,
  formatPrice,
  type AdminOrder,
  type OrderStatus,
} from "../lib/data";
import { Toast } from "../components/Toast";

const STATUS_TONE: Record<OrderStatus, string> = {
  pending: "bg-hj-gold-wash text-hj-gold-deep",
  confirmed: "bg-hj-sand text-hj-ink-soft",
  shipped: "bg-hj-sand-2 text-hj-ink-soft",
  delivered: "bg-hj-success/10 text-hj-success",
  cancelled: "bg-hj-danger/10 text-hj-danger",
};

function StatusPill({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-block shrink-0 rounded-sm px-2 py-1 text-[10px] uppercase tracking-[0.12em] ${STATUS_TONE[status]}`}
    >
      {status}
    </span>
  );
}

/**
 * The order body, shared by the desktop side panel and the mobile sheet. One
 * copy so the two can never drift on what an order actually shows.
 */
function OrderDetail({
  order,
  onStatus,
}: {
  order: AdminOrder;
  onStatus: (id: string, next: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] uppercase tracking-[0.16em] text-hj-muted">
          Order
        </p>
        <p className="mt-1.5 font-mono text-sm text-hj-ink">
          {order.orderNumber}
        </p>
        <p className="mt-1 text-xs text-hj-muted">
          {formatDate(order.createdAt)}
        </p>
      </div>

      <div>
        <p className="text-[10px] uppercase tracking-[0.16em] text-hj-muted">
          Customer
        </p>
        <dl className="mt-2.5 space-y-2 text-sm">
          <div>
            <dt className="text-[11px] text-hj-muted">Name</dt>
            <dd className="text-hj-ink">{order.customer.fullName}</dd>
          </div>
          <div>
            <dt className="text-[11px] text-hj-muted">Phone</dt>
            <dd>
              <a
                href={`tel:${order.customer.phone}`}
                className="tap-target text-hj-ink hover:text-hj-gold-deep"
              >
                {order.customer.phone}
              </a>
            </dd>
          </div>
          {order.customer.email && (
            <div>
              <dt className="text-[11px] text-hj-muted">Email</dt>
              <dd className="break-all text-hj-ink">{order.customer.email}</dd>
            </div>
          )}
          <div>
            <dt className="text-[11px] text-hj-muted">Deliver to</dt>
            <dd className="leading-relaxed text-hj-ink">
              {order.customer.address}
              <br />
              {order.customer.city}, {order.customer.province}
              {order.customer.postalCode ? ` ${order.customer.postalCode}` : ""}
              <br />
              {order.customer.country}
            </dd>
          </div>
          {order.customer.notes && (
            <div>
              <dt className="text-[11px] text-hj-muted">Notes</dt>
              <dd className="leading-relaxed text-hj-ink">
                {order.customer.notes}
              </dd>
            </div>
          )}
        </dl>
      </div>

      <div>
        <p className="text-[10px] uppercase tracking-[0.16em] text-hj-muted">
          Pieces booked
        </p>
        <ul className="mt-3 space-y-2.5">
          {order.items.map((item, i) => (
            <li
              key={`${item.productId}-${i}`}
              className="flex gap-3 rounded-sm border border-hj-border p-2"
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt=""
                  className="h-16 w-12 rounded-sm object-cover"
                />
              ) : (
                <div className="h-16 w-12 rounded-sm bg-hj-sand" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-hj-ink">{item.name}</p>
                <p className="mt-0.5 text-[11px] text-hj-muted">
                  {[item.size, item.color].filter(Boolean).join(" · ")}
                  {item.size || item.color ? " · " : ""}×{item.qty}
                </p>
                <p className="mt-1 text-xs text-hj-ink">
                  {formatPrice(item.price * item.qty)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-1.5 border-t border-hj-border pt-4 text-sm">
        <div className="flex justify-between">
          <span className="text-hj-muted">Subtotal</span>
          <span>{formatPrice(order.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-hj-muted">Delivery</span>
          <span>
            {order.shipping === 0
              ? "To confirm"
              : formatPrice(order.shipping)}
          </span>
        </div>
        <div className="flex justify-between pt-1 font-medium text-hj-ink">
          <span>Order total</span>
          <span>{formatPrice(order.total)}</span>
        </div>
        <p className="pt-1 text-[10px] uppercase tracking-[0.14em] text-hj-muted">
          Payment ·{" "}
          {order.paymentMethod === "pending"
            ? "to arrange on confirmation"
            : order.paymentMethod}
        </p>
      </div>

      <label className="block">
        <span className="text-[10px] uppercase tracking-[0.16em] text-hj-muted">
          Update status
        </span>
        <select
          value={order.status}
          onChange={(e) => onStatus(order.id, e.target.value)}
          className="mt-2 h-11 w-full rounded-sm border border-hj-border bg-white px-3 text-sm focus:border-hj-gold focus:outline-none"
        >
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export function OrdersPage() {
  const [rows, setRows] = useState<AdminOrder[]>([]);
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .get<AdminOrder[]>("/orders", {
        params: { status: status || undefined },
      })
      .then(({ data }) => {
        if (cancelled) return;
        setRows(data);
        setSelected((prev) =>
          prev ? (data.find((o) => o.id === prev.id) ?? null) : null
        );
      })
      .catch(() => {
        if (!cancelled) setToast("Failed to load orders");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [status]);

  /**
   * The sheet is the only way to read an order on a phone, so it covers the
   * page — which means the page behind it must not scroll. Desktop shows the
   * same order in a side panel and is left alone.
   */
  useEffect(() => {
    if (!selected) return;
    if (!window.matchMedia("(max-width: 1279px)").matches) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [selected]);

  async function updateStatus(id: string, next: string) {
    try {
      const { data } = await api.patch<AdminOrder>(`/orders/${id}/status`, {
        status: next,
      });
      setRows((r) => r.map((o) => (o.id === id ? data : o)));
      setSelected((prev) => (prev?.id === id ? data : prev));
      setToast(`Marked as ${next}`);
    } catch {
      setToast("Status update failed");
    }
  }

  const revenue = rows
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);
  const pending = rows.filter((o) => o.status === "pending").length;

  const FILTERS: { value: string; label: string }[] = [
    { value: "", label: "All" },
    ...ORDER_STATUSES.map((s) => ({ value: s, label: s })),
  ];

  return (
    <div>
      <div>
        <p className="text-[10px] uppercase tracking-[0.18em] text-hj-muted">
          Operations
        </p>
        <h1 className="mt-2 font-display text-4xl text-hj-ink">Orders</h1>
        <div className="rule-gold mt-3 h-px w-20" />
        <p className="mt-3 text-sm text-hj-muted">
          {loading
            ? "Loading…"
            : `${rows.length} bookings · ${formatPrice(revenue)} booked`}
        </p>
      </div>

      {/* Status as a scrolling row of chips rather than a select: on a phone it
          shows every option at once and each one is a proper tap target. */}
      <div className="scrollbar-none -mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:px-0">
        {FILTERS.map((f) => {
          const on = status === f.value;
          return (
            <button
              key={f.value || "all"}
              type="button"
              onClick={() => setStatus(f.value)}
              className={`h-10 shrink-0 rounded-sm border px-4 text-[11px] uppercase tracking-[0.12em] transition-colors ${
                on
                  ? "border-hj-gold bg-hj-gold-wash text-hj-gold-deep"
                  : "border-hj-border bg-white text-hj-muted hover:border-hj-gold-soft"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <p className="mt-6 text-[11px] uppercase tracking-[0.16em] text-hj-muted">
        {loading
          ? "Loading…"
          : `${rows.length} ${rows.length === 1 ? "order" : "orders"}${
              pending ? ` · ${pending} pending` : ""
            }`}
      </p>

      {/* ---------------------------------------------- Phone and tablet: cards */}
      <ul className="mt-4 space-y-3 xl:hidden">
        {rows.map((o) => {
          const cover = o.items.find((i) => i.image)?.image;
          const pieces = o.items.reduce((n, i) => n + i.qty, 0);
          return (
            <li key={o.id}>
              <button
                type="button"
                onClick={() => setSelected(o)}
                className="w-full rounded-sm border border-hj-border bg-white p-4 text-left transition-colors hover:border-hj-gold-soft"
              >
                <div className="flex items-start gap-3">
                  {cover ? (
                    <img
                      src={cover}
                      alt=""
                      className="h-12 w-12 shrink-0 rounded-sm object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 shrink-0 rounded-sm bg-hj-sand" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-hj-ink">
                      {o.customer.fullName}
                    </p>
                    <p className="mt-0.5 font-mono text-[11px] text-hj-muted">
                      {o.orderNumber}
                    </p>
                    <p className="mt-1 text-[11px] text-hj-muted">
                      {formatDate(o.createdAt)}
                    </p>
                    <p className="mt-0.5 text-[11px] uppercase tracking-[0.1em] text-hj-muted">
                      {o.customer.city} · {pieces}{" "}
                      {pieces === 1 ? "piece" : "pieces"}
                    </p>
                  </div>
                  <StatusPill status={o.status} />
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-hj-border pt-3">
                  <span className="font-display text-lg text-hj-ink">
                    {formatPrice(o.total)}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.12em] text-hj-muted">
                    {o.paymentMethod === "pending"
                      ? "Payment · pending"
                      : `Payment · ${o.paymentMethod}`}
                  </span>
                </div>
              </button>
            </li>
          );
        })}
        {!loading && rows.length === 0 && (
          <li className="rounded-sm border border-hj-border bg-white px-4 py-16 text-center text-sm text-hj-muted">
            No orders in this view.
          </li>
        )}
      </ul>

      {/* ------------------------------------------------- Desktop: table + panel */}
      <div className="mt-7 hidden gap-6 xl:grid xl:grid-cols-[minmax(0,1fr)_400px]">
        <div className="overflow-x-auto rounded-sm border border-hj-border bg-white">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="border-b border-hj-border bg-hj-cream text-[10px] uppercase tracking-[0.14em] text-hj-muted">
              <tr>
                <th className="px-4 py-3.5 font-medium">Order</th>
                <th className="px-4 py-3.5 font-medium">Customer</th>
                <th className="px-4 py-3.5 font-medium">City</th>
                <th className="px-4 py-3.5 font-medium">Items</th>
                <th className="px-4 py-3.5 font-medium">Total</th>
                <th className="px-4 py-3.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hj-border">
              {rows.map((o) => (
                <tr
                  key={o.id}
                  onClick={() => setSelected(o)}
                  className={`cursor-pointer transition-colors ${
                    selected?.id === o.id
                      ? "bg-hj-gold-wash"
                      : "hover:bg-hj-cream/60"
                  }`}
                >
                  <td className="px-4 py-3.5">
                    <p className="font-mono text-xs text-hj-ink">
                      {o.orderNumber}
                    </p>
                    <p className="mt-0.5 text-[11px] text-hj-muted">
                      {formatDate(o.createdAt)}
                    </p>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-hj-ink">{o.customer.fullName}</p>
                    <p className="mt-0.5 text-[11px] text-hj-muted">
                      {o.customer.phone}
                    </p>
                  </td>
                  <td className="px-4 py-3.5 text-hj-muted">
                    {o.customer.city}
                  </td>
                  <td className="px-4 py-3.5 text-hj-muted">
                    {o.items.reduce((n, i) => n + i.qty, 0)}
                  </td>
                  <td className="px-4 py-3.5">{formatPrice(o.total)}</td>
                  <td className="px-4 py-3.5">
                    <StatusPill status={o.status} />
                  </td>
                </tr>
              ))}
              {!loading && rows.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-16 text-center text-sm text-hj-muted"
                  >
                    No orders in this view.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <aside className="h-fit rounded-sm border border-hj-border bg-white p-5">
          {!selected ? (
            <div className="py-10 text-center">
              <p className="font-display text-xl text-hj-ink">Order details</p>
              <p className="mt-2 text-sm text-hj-muted">
                Select a row to see the customer, the pieces booked and the
                delivery address.
              </p>
            </div>
          ) : (
            <OrderDetail order={selected} onStatus={updateStatus} />
          )}
        </aside>
      </div>

      {/* ------------------------------------------------- Phone: detail sheet */}
      {selected && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <button
            type="button"
            aria-label="Close order"
            onClick={() => setSelected(null)}
            className="absolute inset-0 bg-hj-ink/45 backdrop-blur-[2px]"
          />
          <div className="absolute inset-x-0 bottom-0 top-10 flex flex-col rounded-t-lg bg-hj-canvas shadow-[0_-8px_40px_rgb(10_10_10/0.25)]">
            <div className="flex shrink-0 items-center justify-between border-b border-hj-border px-5 py-4">
              <div className="min-w-0">
                <p className="truncate font-display text-xl text-hj-ink">
                  {selected.customer.fullName}
                </p>
                <p className="mt-0.5 font-mono text-[11px] text-hj-muted">
                  {selected.orderNumber}
                </p>
              </div>
              <button
                type="button"
                aria-label="Close order"
                onClick={() => setSelected(null)}
                className="flex h-11 w-11 shrink-0 items-center justify-center text-hj-muted transition-colors hover:text-hj-ink"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="m2 2 12 12M14 2 2 14" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain p-5">
              <OrderDetail order={selected} onStatus={updateStatus} />
            </div>
          </div>
        </div>
      )}

      <Toast message={toast} onDone={() => setToast("")} />
    </div>
  );
}
