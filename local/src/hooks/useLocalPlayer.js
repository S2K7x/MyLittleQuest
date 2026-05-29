import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const PLAYER_ID = 'local-player-1';

async function fetchPlayer() {
  const res = await fetch(`/api/player/${PLAYER_ID}`);
  if (!res.ok) throw new Error('Player not found');
  return res.json();
}

export function useLocalPlayer() {
  return useQuery({
    queryKey: ['player', PLAYER_ID],
    queryFn: fetchPlayer,
    staleTime: 10_000
  });
}

export function useUpdatePlayer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (fields) => {
      const res = await fetch(`/api/player/${PLAYER_ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields)
      });
      if (!res.ok) throw new Error('Update failed');
      return res.json();
    },
    onSuccess: (data) => qc.setQueryData(['player', PLAYER_ID], data)
  });
}
