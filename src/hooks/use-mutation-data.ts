import {
    MutationFunction,
    MutationKey,
    useMutation,
    useQueryClient,
  } from '@tanstack/react-query';
  import { toast } from 'sonner';
  
  export const useMutationData = (
    mutationKey: MutationKey,
    mutationFn: MutationFunction<any, any>,
    queryKey?: string,
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void
  ) => {
    const client = useQueryClient();
    const { mutate, isPending } = useMutation({
      mutationKey,
      mutationFn,
      onSuccess: (data) => {
        if (onSuccess) onSuccess(data);
        return toast(data?.status === 200 ? 'Success' : 'Error', {
          description: data.data,
        });
      },
      onError: (error) => {
        if (onError) onError(error);
        return toast('Error', {
          description: error?.message,
        });
      },
      onSettled: async () => {
        await client.invalidateQueries({ queryKey: [queryKey] });
      },
    });
  
    return { mutate, isPending };
  };
