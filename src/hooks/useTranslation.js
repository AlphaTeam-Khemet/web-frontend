import { useMutation } from '@tanstack/react-query';
import { translationApi } from '../api/translationApi';
export function useUploadTranslationImage() { return useMutation({ mutationFn: async (formData) => { const { data } = await translationApi.uploadImage(formData); return data; } }); }
