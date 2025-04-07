'use server';
import { clerkClient } from '@clerk/nextjs/server';

export async function setRole(userId: string, role: string) {
  const client = await clerkClient();
  try {
    await client.users.updateUser(userId, {
      publicMetadata: { role },
    });
    console.log(`Role ${role} set for user ${userId}`);
  } catch (error) {
    console.error('Error setting role:', error);
  }
}