export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <span
            className="inline-block size-3 rounded-full bg-brand-red"
            aria-hidden="true"
          />
          <span className="text-2xl font-semibold tracking-widest text-fg">
            LABBOR
          </span>
          <span className="text-2xl font-semibold tracking-widest text-fg-muted">
            STUDIO
          </span>
        </div>
        <p className="text-caption text-fg-muted">
          Зуботехническая лаборатория — SaaS CMS
        </p>
      </div>
    </main>
  );
}
