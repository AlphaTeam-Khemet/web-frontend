import ArtifactCard from './ArtifactCard';
export default function ArtifactGrid({ artifacts = [] }) { return <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{artifacts.map((artifact) => <ArtifactCard key={artifact.id} artifact={artifact} />)}</div>; }
