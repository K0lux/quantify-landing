export function DashboardPageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div className="mb-7">
      <p className="mb-2 text-sm font-semibold uppercase tracking-[0.12em] text-orange-700">{eyebrow}</p>
      <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
      <p className="mt-2 max-w-2xl text-slate-600">{description}</p>
    </div>
  )
}
