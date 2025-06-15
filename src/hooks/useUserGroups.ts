
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const fetchUserGroups = async (userId: string | undefined): Promise<string[]> => {
  if (!userId) return [];

  const { data, error } = await supabase
    .from('user_groups')
    .select('group_id')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user groups:', error);
    throw new Error(error.message);
  }

  return data.map((item) => item.group_id);
};

export const useUserGroups = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['userGroups', userId],
    queryFn: () => fetchUserGroups(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
