import { Link } from 'react-router-dom';
export default function ArtifactCard({ artifact }) {
  return <Link to={`/artifacts/${artifact.id}`} className="block overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"><div className="h-56 bg-khemet-beige">{artifact.image && <img src={artifact.image} alt={artifact.title} className="h-full w-full object-cover" />}</div><div className="p-4"><h3 className="font-display text-xl font-semibold text-khemet-dark">{artifact.title}</h3><p className="mt-1 text-sm text-khemet-gray">{artifact.period}</p></div></Link>;
}
