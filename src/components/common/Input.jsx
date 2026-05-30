export default function Input({ label, className = '', ...props }) {
  return (
    <label className="block">
      {label && <span className="mb-2 block text-sm font-medium text-khemet-brown">{label}</span>}
      <input className={`w-full rounded-xl border border-khemet-beige bg-white px-4 py-3 outline-none transition focus:border-khemet-gold focus:ring-2 focus:ring-khemet-gold/20 ${className}`} {...props} />
    </label>
  );
}
