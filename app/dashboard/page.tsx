import { auth, clerkClient } from '@clerk/nextjs/server';

export default async function AdminPage() {
  const { sessionClaims, userId } = await auth();

  if (!userId) return <div>Please sign in</div>;

  console.log('Full Session Claims:', sessionClaims);
  console.log('Metadata:', sessionClaims?.metadata);

  const currentUserRole = (sessionClaims?.metadata as { role?: string })?.role;

  if (currentUserRole !== 'admin') {
    return <div>You are not authorized. Role: {currentUserRole || 'none'}</div>;
  }

  const client = await clerkClient();
  const users = await client.users.getUserList();
  console.log('Users Data:', users.data);

  return (
    <div>
      <h1>Welcome to the Admin Dashboard!</h1>
      <p>Your Role: {currentUserRole}</p>
      <ul>
        {users.data.map((user) => (
          <li key={user.id}>
            {user.emailAddresses[0].emailAddress} - Role: {(user.publicMetadata.role as string) || 'Not set'}
          </li>
        ))}
      </ul>
    </div>
  );
}