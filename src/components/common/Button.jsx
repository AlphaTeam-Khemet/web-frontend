export default function Button({ children, className = '', ...props }) {
  return <button className={`rounded-xl bg-khemet-gold px-5 py-3 font-medium text-khemet-dark transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 ${className}`} {...props}>{children}</button>;
}
