'use client'

import * as Clerk from '@clerk/elements/common'
import * as SignIn from '@clerk/elements/sign-in'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LoginPage() {

    const {isLoaded, isSignedIn, user}=useUser(); 
    const router=useRouter();

    useEffect(() => {
      if (isLoaded && isSignedIn) { 
        const role = user?.publicMetadata.role;
        if (role) {
          router.push(`/${role}`);
        }
      }
    }, [isLoaded, isSignedIn, user, router]);

  return (
    <div className="flex h-screen items-center bg-skyLight justify-center">
      {!isLoaded ? ( // Display loading text if user data is not loaded yet
        <h2 className="text-xl font-bold">Logging you in...</h2>
      ) : (
      <SignIn.Root>
        <SignIn.Step
          name="start"
          className="bg-white p-12 rounded-md shadow-2xl flex flex-col gap-2"
        >
            <h1 className='bg-white text-xl font-bold flex items-center gap-2'>
                <Image src="/logo.png" alt="logo" width={24} height={24}/>
                SKOOLU
            </h1>
            <h2 className='text-gray-400'>Sign In to your account</h2>

            <Clerk.GlobalError className='text-sm text-red-400'/>
            <Clerk.Field name="identifier" className='flex flex-col gap-2'>
                <Clerk.Label className='text-xs text-gray-500'> Username</Clerk.Label>
                <Clerk.Input type='text'required className='p-2 rounded-md ring-1 ring-gray-300'/>
                <Clerk.FieldError className='text-sm text-red-400'/>
            </Clerk.Field>
            <Clerk.Field name="password" className='flex flex-col gap-2'>
                <Clerk.Label className='text-xs text-gray-500'> Password</Clerk.Label>
                <Clerk.Input type='password'required className='p-2 rounded-md ring-1 ring-gray-300'/> 
                <Clerk.FieldError className='text-sm text-red-400'/>
            </Clerk.Field>
            <SignIn.Action submit className='bg-blue-500 text-white my-1 rounded-md text-sm p-[10px]'>Sign In</SignIn.Action>

          {/* <header className="text-center">
            <h1 className="mt-4 text-xl font-medium tracking-tight text-zinc-950">
              Sign in to Skoolu 
            </h1>
          </header>
          <Clerk.GlobalError className="block text-sm text-red-400" />
          <div className="space-y-4">
            <Clerk.Field name="identifier" className="space-y-2">
              <Clerk.Label className="text-sm font-medium text-zinc-950">Username</Clerk.Label>
              <Clerk.Input
                type="text"
                required
                className="w-full rounded-md bg-white px-3.5 py-2 text-sm outline-none ring-1 ring-inset ring-zinc-300 hover:ring-zinc-400 focus:ring-[1.5px] focus:ring-zinc-950 data-[invalid]:ring-red-400"
              />
              <Clerk.FieldError className="block text-sm text-red-400" />
            </Clerk.Field>
            <Clerk.Field name="password" className="space-y-2">
              <Clerk.Label className="text-sm  font-medium text-zinc-950">Password</Clerk.Label>
              <Clerk.Input
                type="password"
                required
                className="w-full rounded-md bg-white px-3.5 py-2 text-sm outline-none ring-1 ring-inset ring-zinc-300 hover:ring-zinc-400 focus:ring-[1.5px] focus:ring-zinc-950 data-[invalid]:ring-red-400"
              />
              <Clerk.FieldError className="block text-sm text-red-400" />
            </Clerk.Field>
          </div>
          <SignIn.Action
            submit
            className="w-full rounded-md bg-zinc-950 px-3.5 py-1.5 text-center text-sm font-medium text-white shadow outline-none ring-1 ring-inset ring-zinc-950 hover:bg-zinc-800 focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-zinc-950 active:text-white/70"
          >
            Sign In
          </SignIn.Action>
          <p className="text-center text-sm text-zinc-500">
            No account?{' '}
            <a
              href="#"
              className="font-medium text-zinc-950 decoration-zinc-950/20 underline-offset-4 outline-none hover:text-zinc-700 hover:underline focus-visible:underline"
            >
              Create an account
            </a>
          </p> */}
        </SignIn.Step>
      </SignIn.Root>
      )}
    </div>
  )
}