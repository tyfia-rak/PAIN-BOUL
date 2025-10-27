import { NextResponse } from 'next/server'
import { BACKEND_URL } from '@/lib/config'

const BASE = `${BACKEND_URL}/api/orders`

async function forward(request: Request, path = '') {
  const cleanPath = path ? (path.startsWith('/') ? path : `/${path}`) : ''
  const url = `${BASE}${cleanPath}`
  
  console.log('🔁 Forwarding request:', {
    method: request.method,
    url,
    path,
    originalUrl: request.url
  })

  const init: RequestInit = {
    method: request.method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    cache: 'no-cache'
  }

  if (request.body && ['POST', 'PUT', 'PATCH'].includes(request.method)) {
    try {
      const body = await request.json()
      init.body = JSON.stringify(body)
      console.log('📦 Request body:', body)
    } catch (err) {
      console.log('No JSON body or error parsing body:', err)
    }
  }

  const originalUrl = new URL(request.url)
  const query = originalUrl.search
  const finalUrl = url + query

  console.log('🎯 Final backend URL:', finalUrl)

  try {
    const res = await fetch(finalUrl, init)
    console.log('📥 Backend response status:', res.status)
    
    const text = await res.text()
    console.log('📥 Backend response text:', text)

    try {
      const json = text ? JSON.parse(text) : null
      console.log('✅ Parsed JSON response:', json)
      return NextResponse.json(json, { status: res.status })
    } catch {
      console.log('❌ Response is not JSON, returning as text')
      return new NextResponse(text, { status: res.status })
    }
  } catch (err) {
    console.error('💥 Fetch error:', err)
    throw err
  }
}

export async function GET(request: Request) {
  try {
    console.log('📨 GET /api/orders request')
    return await forward(request, '')
  } catch (err) {
    console.error('Proxy GET /api/orders error', err)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    console.log('📨 POST /api/orders request')
    return await forward(request, '')
  } catch (err) {
    console.error('Proxy POST /api/orders error', err)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const url = new URL(request.url)
    const fullPath = url.pathname
    console.log('📨 PUT request received:', { fullPath, searchParams: url.searchParams.toString() })

    const pathAfterBase = fullPath.replace('/api/orders', '') || ''
    const status = url.searchParams.get('status')
    
    console.log('🔍 Path analysis:', { 
      fullPath, 
      pathAfterBase, 
      status,
      includesStatus: pathAfterBase.includes('/status')
    })

    // Handle status update specifically
    if (pathAfterBase.includes('/status') && status) {
      const pathParts = pathAfterBase.split('/').filter(Boolean)
      console.log('📋 Path parts:', pathParts)
      
      if (pathParts.length >= 2 && pathParts[1] === 'status') {
        const orderId = pathParts[0]
        const statusPath = `/${orderId}/status?status=${status}`
        console.log('🔄 Status update path:', statusPath)
        return await forward(request, statusPath)
      }
    }
    
    // Regular PUT request
    console.log('🔄 Regular PUT path:', pathAfterBase)
    return await forward(request, pathAfterBase)
  } catch (err) {
    console.error('Proxy PUT /api/orders error:', err)
    return NextResponse.json({ error: 'Erreur lors de la mise à jour de la commande' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url)
    const path = url.pathname
    console.log('🗑️ DELETE request received:', { path, url: url.toString() })
  
    const matches = path.match(/\/api\/orders\/(\d+)/)
    if (!matches) {
      console.error('❌ Invalid delete path:', path)
      return NextResponse.json({ 
        error: 'ID de commande invalide ou manquant'
      }, { status: 400 })
    }
    
    const orderId = matches[1]
    console.log('🎯 Attempting to delete order:', orderId)

    // Add more detailed logging
    console.log('🔄 DELETE request details:', {
      orderId,
      headers: Object.fromEntries(request.headers),
      backendPath: `/${orderId}`
    })
    
    const response = await forward(request, `/${orderId}`)
    
    // Log detailed response info
    console.log('📥 Delete response details:', { 
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers)
    })

    if (response.status === 404) {
      console.warn('⚠️ Backend returned 404 for order deletion. Possible causes:',
        '1. Order was already deleted',
        '2. Order ID format mismatch',
        '3. Backend endpoint expecting different URL format'
      )
    }

    return response
  } catch (err) {
    console.error('💥 Error during deletion:', err)
    return NextResponse.json({ 
      error: 'Erreur lors de la suppression de la commande',
      details: err instanceof Error ? err.message : 'Erreur inconnue'
    }, { status: 500 })
  }
}