
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type Group = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
};

const fetchGroups = async (): Promise<Group[]> => {
  const { data, error } = await supabase
    .from('groups')
    .select('id, name, description, created_at')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching groups:', error);
    throw new Error(error.message);
  }

  return data as Group[];
};

export const useGroups = () => {
  return useQuery({
    queryKey: ['groups'],
    queryFn: fetchGroups,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
