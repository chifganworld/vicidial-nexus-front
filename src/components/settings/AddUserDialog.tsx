import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { UserPlus } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import UserGroupsField from './UserGroupsField';

const formSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  sipNumber: z.string().optional(),
  sipPassword: z.string().optional(),
  webrtcNumber: z.string().optional(),
  roles: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one role.',
  }),
  group_ids: z.array(z.string()).optional(),
});

const ROLES = [
  { id: 'agent', label: 'Agent' },
  { id: 'supervisor', label: 'Supervisor' },
  { id: 'admin', label: 'Admin' },
];

const createUser = async (values: z.infer<typeof formSchema>) => {
    const { data, error } = await supabase.functions.invoke('create-user', {
        body: {
            email: values.email,
            password: values.password,
            full_name: values.fullName,
            roles: values.roles,
            sip_number: values.sipNumber,
            webrtc_number: values.webrtcNumber,
            sip_password: values.sipPassword,
            group_ids: values.group_ids,
        },
    });

    if (error) {
        try {
            const errorBody = await error.context.json();
            throw new Error(errorBody.error || error.message);
        } catch {
            throw new Error(error.message);
        }
    }
    
    return data;
};

const AddUserDialog: React.FC = () => {
    const [open, setOpen] = React.useState(false);
    const queryClient = useQueryClient();
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: '',
            email: '',
            password: '',
            sipNumber: '',
            webrtcNumber: '',
            sipPassword: '',
            roles: ['agent'],
            group_ids: [],
        },
    });

    const mutation = useMutation({
        mutationFn: createUser,
        onSuccess: () => {
            toast.success('User created successfully!');
            queryClient.invalidateQueries({ queryKey: ['usersForManagement'] });
            setOpen(false);
            form.reset();
        },
        onError: (error: Error) => {
            toast.error(`Failed to create user: ${error.message}`);
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        mutation.mutate(values);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <UserPlus className="mr-2 h-4 w-4"/>
                    Add User
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>
                        Create a new user account and assign roles and groups.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
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
                            control={form.control}
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
                            control={form.control}
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
                            control={form.control}
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
                            control={form.control}
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
                            control={form.control}
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

                        <FormField
                            control={form.control}
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
                                            control={form.control}
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
                        <UserGroupsField isLoading={false} />

                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={mutation.isPending}>
                                {mutation.isPending ? 'Creating...' : 'Create User'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default AddUserDialog;
