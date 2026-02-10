import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchActiveChallenge,
  fetchAllChallenges,
  createChallenge,
  updateChallenge,
  deleteChallenge,
  incrementChallenge,
  type Challenge,
  type CreateChallengeRequest,
} from "@/services/challengesService";

// Public Hooks
export function useActiveChallenge() {
  return useQuery({
    queryKey: ["activeChallenge"],
    queryFn: fetchActiveChallenge,
  });
}

export function useIncrementChallenge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      return incrementChallenge(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activeChallenge"] });
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
    },
  });
}

// Admin Hooks
export function useAdminChallenges() {
  return useQuery({
    queryKey: ["challenges"],
    queryFn: fetchAllChallenges,
  });
}

export function useCreateChallenge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateChallengeRequest) => {
      return createChallenge(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
      queryClient.invalidateQueries({ queryKey: ["activeChallenge"] });
    },
  });
}

export function useUpdateChallenge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<CreateChallengeRequest & { isActive: boolean }>) => {
      return updateChallenge(id, updates as any);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
      queryClient.invalidateQueries({ queryKey: ["activeChallenge"] });
    },
  });
}

export function useDeleteChallenge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      return deleteChallenge(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
      queryClient.invalidateQueries({ queryKey: ["activeChallenge"] });
    },
  });
}
