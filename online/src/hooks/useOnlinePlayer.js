import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as db from '../db/supabase.js';

export function useOnlinePlayer(userId) {
  return useQuery({
    queryKey: ['player', userId],
    queryFn:  () => db.getPlayer(userId),
    enabled:  !!userId,
    staleTime: 10_000
  });
}

export function useUpdateOnlinePlayer(userId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (fields) => db.updatePlayer(userId, fields),
    onSuccess:  (data) => qc.setQueryData(['player', userId], data)
  });
}
