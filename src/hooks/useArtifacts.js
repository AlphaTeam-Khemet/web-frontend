import { useQuery } from '@tanstack/react-query';
import { artifactsApi } from '../api/artifactsApi';
export function useArtifacts(params) { return useQuery({ queryKey: ['artifacts', params], queryFn: async () => { const { data } = await artifactsApi.getAll(params); return data; } }); }
