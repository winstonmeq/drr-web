import { auth, clerkClient } from '@clerk/nextjs/server';
import { setRole } from '../actions/setRole';

export default async function AdminPage() {
    
  const { userId } = await auth();

  if (!userId) return <div>Please sign in</div>;

  const client = await clerkClient();
  const users = await client.users.getUserList();

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <ul>
        {users.data.map((user) => (
            <ul key={user.id}>
          <li >
            {user.emailAddresses[0].emailAddress}
            <form action={async () => {
              'use server';
              await setRole(user.id, 'admin');
            }}>
              <button type="submit">Make Admin....</button>
            </form>
          </li>
          <li><span>Role: {(user.publicMetadata.role as string) || 'Not set'}</span></li>
          </ul>
        ))}
      </ul>
    </div>
  );
}