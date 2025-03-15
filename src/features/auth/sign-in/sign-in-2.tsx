import { motion } from 'framer-motion'
import { UserAuthForm } from './components/user-auth-form'

export default function SignIn2() {
  return (
    <div className='container relative grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <div className='relative hidden h-full flex-col bg-gradient-to-br from-amber-100 to-orange-200 p-10 text-orange-900 dark:border-r lg:flex'>
        <div className='absolute inset-0 bg-orange-50 opacity-50' />
        <div className='relative z-20 flex items-center text-lg font-medium'>
          {/* <img src="/images/main.png" alt="Smart-POS" className="mr-2 h-6" /> */}
        </div>

        <motion.img
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          src='/images/main.png'
          className='relative m-auto'
          width={370}
          height={370}
          alt='Smart-POS'
        />

        <div className='relative z-20 mt-auto'>
          <blockquote className='space-y-2'>
            {/* <p className="text-lg">
              &ldquo;This template has saved me countless hours of work and helped me deliver stunning designs to my
              clients faster than ever before.&rdquo;
            </p> */}
            {/* <footer className="text-sm">John Doe</footer> */}
          </blockquote>
        </div>
      </div>
      <div className='lg:p-8'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
          <div className='flex flex-col space-y-2 text-left'>
            <h1 className='text-2xl font-semibold tracking-tight text-orange-800'>
              Login
            </h1>
            <p className='text-sm text-orange-600'>
              Enter your username and password below <br />
              to log into your account
              <br />
            </p>
          </div>
          <UserAuthForm />
          <p className='px-8 text-center text-sm text-orange-600'>
            By clicking login, you agree to our{' '}
            <a
              href='/terms'
              className='underline underline-offset-4 hover:text-orange-800 transition-colors'
            >
              Terms of Service
            </a>{' '}
            and{' '}
            <a
              href='/privacy'
              className='underline underline-offset-4 hover:text-orange-800 transition-colors'
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
