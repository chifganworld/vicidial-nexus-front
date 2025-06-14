
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const fetchUserRoles = async (userId: string | undefined): Promise<string[]> => {
  if (!userId) return [];

  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user roles:', error);
    throw new Error(error.message);
  }

  return data.map((item) => item.role) as string[];
};

export const useUserRoles = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['userRoles', userId],
    queryFn: () => fetchUserRoles(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
