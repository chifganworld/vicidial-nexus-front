
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { UserPlus } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { addUserFormSchema, AddUserFormValues } from './addUserSchema';
import { createUser } from '@/features/users/mutations';
import AddUserFormFields from './AddUserFormFields';

const AddUserDialog: React.FC = () => {
    const [open, setOpen] = React.useState(false);
    const queryClient = useQueryClient();
    
    const form = useForm<AddUserFormValues>({
        resolver: zodResolver(addUserFormSchema),
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

    const onSubmit = (values: AddUserFormValues) => {
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
                        <AddUserFormFields />
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
