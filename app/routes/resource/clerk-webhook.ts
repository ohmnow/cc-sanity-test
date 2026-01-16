import type {Route} from './+types/clerk-webhook'
import {createClient, type SanityClient} from '@sanity/client'
import {projectDetails} from '~/sanity/projectDetails'

// Lazy client initialization - created on first use
let _writeClient: SanityClient | null = null
function getWriteClient(): SanityClient {
  if (!_writeClient) {
    const {projectId, dataset, apiVersion} = projectDetails()
    _writeClient = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      token: process.env.SANITY_WRITE_TOKEN,
    })
  }
  return _writeClient
}

// Webhook secret for verifying requests from Clerk
// Set this in your Clerk Dashboard and .env file
const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

interface ClerkUserData {
  id: string
  email_addresses: Array<{
    email_address: string
    id: string
    verification: {status: string}
  }>
  first_name: string | null
  last_name: string | null
  image_url: string
  created_at: number
  updated_at: number
}

interface ClerkWebhookEvent {
  type: string
  data: ClerkUserData
}

export async function action({request}: Route.ActionArgs) {
  // Only accept POST requests
  if (request.method !== 'POST') {
    return new Response('Method not allowed', {status: 405})
  }

  // Get the Svix headers for verification
  const svix_id = request.headers.get('svix-id')
  const svix_timestamp = request.headers.get('svix-timestamp')
  const svix_signature = request.headers.get('svix-signature')

  // If missing headers, reject
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Missing svix headers', {status: 400})
  }

  // Get the body
  let body: ClerkWebhookEvent
  try {
    body = await request.json()
  } catch {
    return new Response('Invalid JSON', {status: 400})
  }

  // TODO: Add proper Svix signature verification
  // For production, install svix and verify the signature:
  // import { Webhook } from 'svix'
  // const wh = new Webhook(WEBHOOK_SECRET)
  // const payload = await wh.verify(rawBody, headers)

  // For now, we'll process the webhook (add proper verification before production)
  const eventType = body.type
  const userData = body.data

  try {
    switch (eventType) {
      case 'user.created':
        await handleUserCreated(userData)
        break
      case 'user.updated':
        await handleUserUpdated(userData)
        break
      case 'user.deleted':
        await handleUserDeleted(userData)
        break
      default:
        console.log(`Unhandled webhook event type: ${eventType}`)
    }

    return new Response('Webhook processed', {status: 200})
  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response('Internal server error', {status: 500})
  }
}

async function handleUserCreated(userData: ClerkUserData) {
  const primaryEmail = userData.email_addresses.find(
    (email) => email.verification.status === 'verified'
  )?.email_address

  if (!primaryEmail) {
    console.log('No verified email found for user:', userData.id)
    return
  }

  // Check if an investor already exists with this email
  const existingInvestor = await getWriteClient().fetch(
    `*[_type == "investor" && email == $email][0]._id`,
    {email: primaryEmail}
  )

  if (existingInvestor) {
    // Link the Clerk ID to the existing investor
    await getWriteClient()
      .patch(existingInvestor)
      .set({
        clerkId: userData.id,
        updatedAt: new Date().toISOString(),
      })
      .commit()

    console.log(`Linked Clerk user ${userData.id} to existing investor ${existingInvestor}`)
  } else {
    // Create a new investor document
    const newInvestor = {
      _type: 'investor',
      clerkId: userData.id,
      email: primaryEmail,
      name: [userData.first_name, userData.last_name].filter(Boolean).join(' ') || 'Investor',
      status: 'active',
      accreditedStatus: 'pending',
    }

    const result = await getWriteClient().create(newInvestor)
    console.log(`Created new investor ${result._id} for Clerk user ${userData.id}`)
  }
}

async function handleUserUpdated(userData: ClerkUserData) {
  const primaryEmail = userData.email_addresses.find(
    (email) => email.verification.status === 'verified'
  )?.email_address

  // Find the investor by Clerk ID
  const investorId = await getWriteClient().fetch(
    `*[_type == "investor" && clerkId == $clerkId][0]._id`,
    {clerkId: userData.id}
  )

  if (!investorId) {
    console.log('No investor found for Clerk user:', userData.id)
    // Could create one here, but let's just log for now
    return
  }

  // Update the investor document
  await getWriteClient()
    .patch(investorId)
    .set({
      email: primaryEmail || undefined,
      name: [userData.first_name, userData.last_name].filter(Boolean).join(' ') || 'Investor',
    })
    .commit()

  console.log(`Updated investor ${investorId} for Clerk user ${userData.id}`)
}

async function handleUserDeleted(userData: ClerkUserData) {
  // Find the investor by Clerk ID
  const investorId = await getWriteClient().fetch(
    `*[_type == "investor" && clerkId == $clerkId][0]._id`,
    {clerkId: userData.id}
  )

  if (!investorId) {
    console.log('No investor found to delete for Clerk user:', userData.id)
    return
  }

  // Instead of deleting, we'll mark as inactive
  // This preserves historical data (LOIs, etc.)
  await getWriteClient()
    .patch(investorId)
    .set({
      status: 'inactive',
      updatedAt: new Date().toISOString(),
    })
    .commit()

  console.log(`Marked investor ${investorId} as inactive for deleted Clerk user ${userData.id}`)
}

// Loader just returns 404 for GET requests
export function loader() {
  return new Response('Not found', {status: 404})
}
