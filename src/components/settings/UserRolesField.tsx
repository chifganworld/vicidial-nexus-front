
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { UserRole } from '@/types/user';

const ROLES: { id: UserRole; label: string }[] = [
  { id: 'agent', label: 'Agent' },
  { id: 'supervisor', label: 'Supervisor' },
  { id: 'admin', label: 'Admin' },
];

const UserRolesField: React.FC = () => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name="roles"
      render={() => (
          <FormItem>
              <div className="mb-2">
                  <FormLabel>Roles</FormLabel>
              </div>
              <div className="space-y-2">
              {ROLES.map((item) => (
                  <FormField
                      key={item.id}
                      control={control}
                      name="roles"
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
                                              const updatedRoles = checked
                                                  ? [...field.value, item.id]
                                                  : field.value?.filter(
                                                      (value) => value !== item.id
                                                    );
                                              field.onChange(updatedRoles);
                                          }}
                                      />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                      {item.label}
                                  </FormLabel>
                              </FormItem>
                          );
                      }}
                  />
              ))}
              </div>
              <FormMessage />
          </FormItem>
      )}
    />
  );
};

export default UserRolesField;
