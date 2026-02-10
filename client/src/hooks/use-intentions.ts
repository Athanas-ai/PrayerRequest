import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchIntentions,
  createIntention,
  incrementIntentionPrayer,
  markIntentionPrinted,
  type Intention,
  type CreateIntentionRequest,
} from "@/services/intentionsService";

export function useIntentions() {
  return useQuery({
    queryKey: ["intentions"],
    queryFn: fetchIntentions,
  });
}

export function useCreateIntention() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateIntentionRequest) => {
      return createIntention(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["intentions"] });
    },
  });
}

export function useIncrementPrayer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, type }: { id: number; type: 'hailMary' | 'ourFather' | 'rosary' }) => {
      return incrementIntentionPrayer(id, type);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["intentions"] });
    },
  });
}

export function useMarkIntentionPrinted() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      return markIntentionPrinted(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["intentions"] });
    },
  });
}
