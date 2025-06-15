
import { supabase } from '@/integrations/supabase/client';
import { AddUserFormValues } from '@/components/settings/addUserSchema';

export const createUser = async (values: AddUserFormValues) => {
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
