
import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import UserRolesField from './UserRolesField';
import UserGroupsField from './UserGroupsField';

const AddUserFormFields: React.FC = () => {
    const { control } = useFormContext();

    return (
        <div className="space-y-4">
            <FormField
                control={control}
                name="fullName"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                            <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input type="email" placeholder="user@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input type="password" placeholder="A secure password" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="sipNumber"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>SIP Number</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., 1001" {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="sipPassword"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>SIP Password</FormLabel>
                        <FormControl>
                            <Input type="password" placeholder="A secure SIP password" {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="webrtcNumber"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>WebRTC Number</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., 8001" {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <UserRolesField />
            <UserGroupsField isLoading={false} />
        </div>
    );
};

export default AddUserFormFields;
