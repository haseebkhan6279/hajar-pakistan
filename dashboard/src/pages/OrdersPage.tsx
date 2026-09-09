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

  async function updateStatus(id: string, next: string) {
    try {
      const { data } = await api.patch<AdminOrder>(`/orders/${id}/status`, {
        status: next,
      });
      setRows((r) => r.map((o) => (o.id === id ? data : o)));
      if (selected?.id === id) setSelected(data);
      setToast(`Marked as ${next}`);
    } catch {
      setToast("Status update failed");
    }
  }

  const revenue = rows
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
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
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-11 rounded-sm border border-hj-border bg-white px-3 text-sm focus:border-hj-gold focus:outline-none"
        >
          <option value="">All status</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1fr)_400px]">
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
                    <span
                      className={`inline-block rounded-sm px-2 py-1 text-[10px] uppercase tracking-[0.12em] ${STATUS_TONE[o.status]}`}
                    >
                      {o.status}
                    </span>
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
            <div className="space-y-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-hj-muted">
                  Order
                </p>
                <p className="mt-1.5 font-mono text-sm text-hj-ink">
                  {selected.orderNumber}
                </p>
                <p className="mt-1 text-xs text-hj-muted">
                  {formatDate(selected.createdAt)}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-hj-muted">
                  Customer
                </p>
                <dl className="mt-2.5 space-y-2 text-sm">
                  <div>
                    <dt className="text-[11px] text-hj-muted">Name</dt>
                    <dd className="text-hj-ink">
                      {selected.customer.fullName}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] text-hj-muted">Phone</dt>
                    <dd>
                      <a
                        href={`tel:${selected.customer.phone}`}
                        className="text-hj-ink hover:text-hj-gold-deep"
                      >
                        {selected.customer.phone}
                      </a>
                    </dd>
                  </div>
                  {selected.customer.email && (
                    <div>
                      <dt className="text-[11px] text-hj-muted">Email</dt>
                      <dd className="break-all text-hj-ink">
                        {selected.customer.email}
                      </dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-[11px] text-hj-muted">Deliver to</dt>
                    <dd className="leading-relaxed text-hj-ink">
                      {selected.customer.address}
                      <br />
                      {selected.customer.city}, {selected.customer.province}
                      {selected.customer.postalCode
                        ? ` ${selected.customer.postalCode}`
                        : ""}
                      <br />
                      {selected.customer.country}
                    </dd>
                  </div>
                  {selected.customer.notes && (
                    <div>
                      <dt className="text-[11px] text-hj-muted">Notes</dt>
                      <dd className="leading-relaxed text-hj-ink">
                        {selected.customer.notes}
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
                  {selected.items.map((item, i) => (
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
                        <p className="truncate text-sm text-hj-ink">
                          {item.name}
                        </p>
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
                  <span>{formatPrice(selected.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-hj-muted">Delivery</span>
                  <span>
                    {selected.shipping === 0
                      ? "To confirm"
                      : formatPrice(selected.shipping)}
                  </span>
                </div>
                <div className="flex justify-between pt-1 font-medium text-hj-ink">
                  <span>Order total</span>
                  <span>{formatPrice(selected.total)}</span>
                </div>
                <p className="pt-1 text-[10px] uppercase tracking-[0.14em] text-hj-muted">
                  Payment · {selected.paymentMethod === "pending"
                    ? "to arrange on confirmation"
                    : selected.paymentMethod}
                </p>
              </div>

              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.16em] text-hj-muted">
                  Update status
                </span>
                <select
                  value={selected.status}
                  onChange={(e) => void updateStatus(selected.id, e.target.value)}
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
          )}
        </aside>
      </div>

      <Toast message={toast} onDone={() => setToast("")} />
    </div>
  );
}
