//@ts-nocheck
import { type HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { IconBrandFacebook, IconBrandGithub } from '@tabler/icons-react'
import { type LoginRequest, userLogin } from '@/api'
import { storage } from '@/lib/storage'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'

type UserAuthFormProps = HTMLAttributes<HTMLDivElement>

const formSchema = z.object({
  username: z.string().min(1, { message: 'Please enter your username' }),
  password: z
    .string()
    .min(1, {
      message: 'Please enter your password',
    })
    .min(7, {
      message: 'Password must be at least 7 characters long',
    }),
})

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const navigate = useNavigate()

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => userLogin(data),
    onSuccess: (data: any) => {
      storage.setAuthData(data)

      navigate({ to: '/choose' })

      toast({
        title: 'Login successful',
        description: `Welcome back, ${data.user.username}!`,
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Login failed',
        description:
          error instanceof Error ? error.message : 'Please try again',
      })
      setIsLoading(false)
    },
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    loginMutation.mutate({
      username: data.username, // Using email as username
      password: data.password,
    })
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-2'>
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel className='text-orange-700'>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='username'
                      {...field}
                      className='border-orange-200 focus:border-orange-400 focus:ring-orange-400'
                    />
                  </FormControl>
                  <FormMessage className='text-orange-600' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <div className='flex items-center justify-between'>
                    <FormLabel className='text-orange-700'>Password</FormLabel>
                    <Link
                      to='/forgot-password'
                      className='text-sm font-medium text-orange-600 hover:text-orange-800'
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput
                      placeholder='********'
                      {...field}
                      className='border-orange-200 focus:border-orange-400 focus:ring-orange-400'
                    />
                  </FormControl>
                  <FormMessage className='text-orange-600' />
                </FormItem>
              )}
            />
            <Button
              className='mt-2 bg-orange-600 hover:bg-orange-700 text-white'
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>

            <div className='relative my-2'>
              <div className='absolute inset-0 flex items-center'>
                <span className='w-full border-t border-orange-200' />
              </div>
              {/* <div className='relative flex justify-center text-xs uppercase'>
                <span className='bg-white px-2 text-orange-600'>
                  Or continue with
                </span>
              </div> */}
            </div>

            {/* <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                className='w-full border-orange-200 text-orange-700 hover:bg-orange-50 hover:text-orange-800'
                type='button'
                disabled={isLoading}
              >
                <IconBrandGithub className='h-4 w-4 mr-2' /> GitHub
              </Button>
              <Button
                variant='outline'
                className='w-full border-orange-200 text-orange-700 hover:bg-orange-50 hover:text-orange-800'
                type='button'
                disabled={isLoading}
              >
                <IconBrandFacebook className='h-4 w-4 mr-2' /> Facebook
              </Button>
            </div> */}
          </div>
        </form>
      </Form>
    </div>
  )
}
