
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useGroups } from '@/hooks/useGroups';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

interface UserGroupsFieldProps {
  isLoading: boolean;
}

const UserGroupsField: React.FC<UserGroupsFieldProps> = ({ isLoading }) => {
  const { control } = useFormContext();
  const { data: availableGroups, isLoading: isLoadingGroups } = useGroups();

  return (
    <FormField
      control={control}
      name="group_ids"
      render={() => (
          <FormItem>
              <div className="mb-2">
                  <FormLabel>Groups</FormLabel>
              </div>
              {isLoading || isLoadingGroups ? (
                <div className="space-y-2 rounded-md border p-4">
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-24" />
                </div>
              ) : (
              <ScrollArea className="h-32 rounded-md border">
                <div className="p-4 space-y-2">
                {availableGroups?.map((item) => (
                    <FormField
                        key={item.id}
                        control={control}
                        name="group_ids"
                        render={({ field }) => {
                            return (
                                <FormItem
                                    key={item.id}
                                    className="flex flex-row items-center space-x-3 space-y-0"
                                >
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value?.includes(item.id)}
                                            onCheckedChange={(checked) => {
                                                const updatedGroups = checked
                                                    ? [...(field.value || []), item.id]
                                                    : field.value?.filter(
                                                        (value) => value !== item.id
                                                      );
                                                field.onChange(updatedGroups);
                                            }}
                                        />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                        {item.name}
                                    </FormLabel>
                                </FormItem>
                            );
                        }}
                    />
                ))}
                {availableGroups?.length === 0 && <p className="text-sm text-muted-foreground">No groups available.</p>}
                </div>
              </ScrollArea>
              )}
              <FormMessage />
          </FormItem>
      )}
    />
  );
};

export default UserGroupsField;
