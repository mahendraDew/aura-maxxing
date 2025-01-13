import { auth, clerkClient } from '@clerk/nextjs/server'

export async function GET () {
  const { userId } = await auth()
  console.log('user from back: ', userId)
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const client = await clerkClient()

  const user = await client.users.getUser(userId)

  return Response.json({ userData: user })
}
