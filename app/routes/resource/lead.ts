import {type ActionFunctionArgs} from 'react-router'
import {createClient} from '@sanity/client'

import {apiVersion, dataset, projectId} from '~/sanity/projectDetails'

// Create a write client for mutations
const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
})

export async function action({request}: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return Response.json({error: 'Method not allowed'}, {status: 405})
  }

  try {
    const formData = await request.formData()

    // Get required fields
    const name = formData.get('name')?.toString()
    const email = formData.get('email')?.toString()

    if (!name || !email) {
      return Response.json({error: 'Name and email are required'}, {status: 400})
    }

    // Get optional fields
    const phone = formData.get('phone')?.toString() || ''
    const leadType = formData.get('leadType')?.toString() || 'contact'
    const notes = formData.get('message')?.toString() || formData.get('notes')?.toString() || ''

    // Build form data object for additional fields
    const additionalFormData: Record<string, string> = {}
    const additionalFields = [
      'budget', 'neighborhoods', 'bedrooms', 'timeline',
      'propertyAddress', 'propertyType', 'investmentType',
      'investmentBudget', 'experience', 'accreditedStatus', 'company'
    ]

    for (const field of additionalFields) {
      const value = formData.get(field)?.toString()
      if (value) {
        additionalFormData[field] = value
      }
    }

    // Create the lead document
    const document = {
      _type: 'lead',
      name,
      email,
      phone,
      leadType,
      status: 'new',
      notes,
      formData: Object.keys(additionalFormData).length > 0 ? additionalFormData : undefined,
      submittedAt: new Date().toISOString(),
    }

    const result = await writeClient.create(document)

    return Response.json({
      success: true,
      message: 'Thank you for your submission. We\'ll be in touch soon!',
      id: result._id,
    })
  } catch (error) {
    console.error('Error creating lead:', error)
    return Response.json(
      {error: 'An error occurred while processing your submission. Please try again.'},
      {status: 500}
    )
  }
}
