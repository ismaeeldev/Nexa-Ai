
import { redirect } from "next/navigation";
import { auth } from '@/lib/auth';
import { headers } from 'next/headers'


export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers(), })


  // if (!session) {
  //   redirect('/sign-in')
  // }

  return (
    <h1 className="text-3xl font-bold mt-8 text-center">
      {/* {session.user ? `Welcome, ${session.user.name}` : "Not logged in"} */}
      {/* {greeting.data && <p>Server says: {greeting.data.greeting}</p>} */}
    </h1>
  );
}
