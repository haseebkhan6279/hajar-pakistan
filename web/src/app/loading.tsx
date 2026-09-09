export default function Loading() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-20 md:px-8">
      <div className="h-4 w-28 animate-pulse bg-hj-sand" />
      <div className="mt-6 h-12 w-2/3 max-w-lg animate-pulse bg-hj-sand" />
      <div className="mt-16 grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-[3/4] animate-pulse bg-hj-sand" />
            <div className="mt-4 h-3 w-20 animate-pulse bg-hj-sand" />
            <div className="mt-2.5 h-5 w-3/4 animate-pulse bg-hj-sand" />
          </div>
        ))}
      </div>
    </div>
  );
}
