import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChurchIcon } from '@/components/icons';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-500 to-blue-400 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>
        
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="flex justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
              Welcome to the Church Connect Platform
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Member Management Made Simple
            </h1>
            <div className="mt-6 flex justify-center">
              <ChurchIcon className="h-24 w-24 text-blue-600" />
            </div>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Track attendance, manage follow-ups, and build deeper connections with your church members through our comprehensive management system.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/dashboard">
                <Button size="lg" className="rounded-md px-6 py-3 text-base">
                  Go to Dashboard
                </Button>
              </Link>
              <Link href="/auth/login" className="text-sm font-semibold leading-6 text-blue-600">
                Login <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
          <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-blue-400 to-blue-600 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"></div>
        </div>
      </div>
    </div>
  );
}