export default function AuthCard({ title, subtitle, children }) {
  return <section className="w-full max-w-md rounded-3xl bg-white/95 p-8 text-khemet-dark shadow-2xl"><h1 className="font-display text-4xl font-bold">{title}</h1>{subtitle && <p className="mt-2 text-sm text-khemet-gray">{subtitle}</p>}<div className="mt-8">{children}</div></section>;
}
