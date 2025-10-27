'use client'

import React, { useEffect, useState } from 'react'
import { BACKEND_URL } from '@/lib/config'
import Swal from 'sweetalert2'

const STATUS_DISPLAY: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
  CONFIRMED: { label: 'Confirmée', color: 'bg-blue-100 text-blue-800' },
  PREPARING: { label: 'En préparation', color: 'bg-purple-100 text-purple-800' },
  READY: { label: 'Prête', color: 'bg-green-100 text-green-800' },
  DELIVERED: { label: 'Livrée', color: 'bg-gray-100 text-gray-800' },
  CANCELLED: { label: 'Annulée', color: 'bg-red-100 text-red-800' }
}

interface DisplayOrderItem {
  id: number
  name: string
  price: number
  quantity: number
}

interface DisplayOrder {
  id: number
  customerId?: number
  productIds: number[]
  orderDate?: string
  status: string
  totalAmount: number
  createdAt?: string
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  items: DisplayOrderItem[]
}

export default function CommandesSection({ query }: { query: string }) {
  const [orders, setOrders] = useState<DisplayOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<DisplayOrder | null>(null)
  const [filterStatus, setFilterStatus] = useState<'ALL' | string>('ALL')
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      console.log('🔄 Starting to fetch orders...')
      
      const res = await fetch('/api/orders', {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      console.log('📥 Orders fetch response status:', res.status)
      
      if (!res.ok) {
        const errorText = await res.text()
        console.error('❌ Orders fetch error:', errorText)
        throw new Error(errorText || 'Failed to fetch orders')
      }
      
      const dtos = await res.json()
      console.log('✅ Raw orders data from backend:', dtos)

      if (!Array.isArray(dtos)) {
        throw new Error('Format de réponse invalide')
      }

      // CORRECTION: Votre backend retourne des objets avec "id" (pas "idOrder")
      const enriched = await Promise.all(dtos.map(async (dto: any) => {
        console.log('🔄 Processing order:', dto)
        
        // CORRECTION: Votre backend utilise "id" dans la réponse JSON
        const display: DisplayOrder = {
          id: dto.id, // ← Votre backend retourne "id": 2, "id": 3, etc.
          customerId: dto.customerId,
          productIds: Array.isArray(dto.productIds) ? dto.productIds : [],
          orderDate: dto.orderDate,
          status: dto.status || 'PENDING',
          totalAmount: dto.totalAmount ?? 0,
          createdAt: dto.orderDate,
          customerName: dto.customerName || undefined,
          customerEmail: dto.customerEmail || undefined,
          customerPhone: dto.customerPhone || undefined,
          items: []
        }

        // CORRECTION: Vérifier si les produits sont déjà dans la réponse
        if (Array.isArray(dto.items) && dto.items.length > 0) {
          display.items = dto.items.map((it: any) => ({
            id: it.productId,
            name: it.productName,
            price: it.price,
            quantity: it.quantity || 1
          }))
        } else if (Array.isArray(dto.productIds) && dto.productIds.length > 0) {
          // Fallback: fetch product details
          console.log(`🔄 Fetching products for order ${display.id}:`, dto.productIds)
          const products = await Promise.all(dto.productIds.map(async (pid: number) => {
            try {
              // CORRECTION: Utiliser le bon endpoint pour les produits
              const pRes = await fetch(`${BACKEND_URL}/api/products/${pid}`)
              if (!pRes.ok) {
                console.warn(`❌ Failed to fetch product ${pid}:`, pRes.status)
                return null
              }
              const product = await pRes.json()
              return product
            } catch (err) {
              console.error(`💥 Error fetching product ${pid}:`, err)
              return null
            }
          }))

          display.items = products.filter(Boolean).map((p: any) => ({
            id: p.idProduct || p.id,
            name: p.name,
            price: p.price,
            quantity: 1
          }))
        } else {
          console.log(`ℹ️ No products found for order ${display.id}`)
        }

        // Fetch customer info if not present
        if (!display.customerName && dto.customerId) {
          try {
            console.log(`🔄 Fetching customer ${dto.customerId} for order ${display.id}`)
            const cRes = await fetch(`${BACKEND_URL}/api/customers/${dto.customerId}`)
            if (cRes.ok) {
              const c = await cRes.json()
              display.customerName = `${c.firstName} ${c.lastName}`
              display.customerEmail = c.email
              display.customerPhone = c.phone
            }
          } catch (err) {
            console.warn('Failed to fetch customer for order', dto.id, err)
          }
        }

        if (!display.customerName) {
          display.customerName = `Client #${display.customerId || 'Inconnu'}`
        }

        return display
      }))

      setOrders(enriched)
    } catch (error) {
      console.error('💥 Error fetching orders:', error)
      await Swal.fire({ 
        icon: 'error', 
        title: 'Erreur', 
        text: 'Impossible de charger les commandes' 
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    console.log('🔄 updateOrderStatus called:', { orderId, newStatus })
    
    if (!Object.keys(STATUS_DISPLAY).includes(newStatus)) {
      await Swal.fire({ 
        icon: 'error', 
        title: 'Statut invalide', 
        text: 'Le statut sélectionné n\'est pas valide.' 
      })
      return
    }

    try {
      const result = await Swal.fire({
        title: 'Confirmer le changement',
        text: `Voulez-vous vraiment changer le statut en "${STATUS_DISPLAY[newStatus].label}" ?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Oui, modifier',
        cancelButtonText: 'Annuler'
      })

      if (!result.isConfirmed) return

      setActionLoading(orderId)
      
      const url = `/api/orders/${orderId}/status?status=${newStatus}`
      console.log('📤 Making PUT request to:', url)
      
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })

      console.log('📥 Status update response status:', res.status)
      
      if (!res.ok) {
        const errorText = await res.text()
        console.error('❌ Status update error:', errorText)
        throw new Error(errorText || `HTTP ${res.status}: Failed to update order status`)
      }

      // CORRECTION: Votre backend peut retourner une réponse vide ou un objet
      try {
        const responseData = await res.json()
        console.log('✅ Status update success:', responseData)
      } catch {
        console.log('✅ Status update success (no response body)')
      }

      // Optimistic update
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null)
      }

      await Swal.fire({ 
        icon: 'success', 
        title: 'Statut mis à jour', 
        text: `La commande a été mise à jour avec le statut : ${STATUS_DISPLAY[newStatus].label}` 
      })
    } catch (err) {
      console.error('💥 Error updating status:', err)
      await Swal.fire({ 
        icon: 'error', 
        title: "Erreur", 
        text: err instanceof Error ? err.message : 'Erreur lors de la mise à jour du statut' 
      })
    } finally {
      setActionLoading(null)
    }
  }

  const deleteOrder = async (orderId: number) => {
    console.log('🗑️ deleteOrder called:', orderId)
    
    try {
      const result = await Swal.fire({
        title: 'Supprimer cette commande ?',
        text: "Cette action est irréversible.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler'
      })

      if (!result.isConfirmed) return

      setActionLoading(orderId)
      
      console.log('📤 Making DELETE request for order:', orderId)
      
      const res = await fetch(`/api/orders/${orderId}`, { 
        method: 'DELETE',
        headers: {
          'Accept': 'application/json'
        }
      })

      console.log('📥 Delete response status:', res.status)

      // CORRECTION: Gérer différents codes de statut
      if (res.status === 404) {
        throw new Error('La commande n\'existe plus ou a déjà été supprimée')
      }
      
      if (!res.ok) {
        let errorMessage = 'Erreur lors de la suppression de la commande'
        try {
          const errorData = await res.json()
          errorMessage = errorData.error || errorData.message || errorMessage
        } catch (err) {
          // Le backend peut retourner une réponse vide
          console.log('Backend returned empty response for DELETE')
        }
        throw new Error(errorMessage)
      }
      
      // Mise à jour optimiste
      setOrders(prev => prev.filter(o => o.id !== orderId))
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(null)
      }
      
      await Swal.fire({ 
        icon: 'success', 
        title: 'Commande supprimée', 
        text: 'La commande a été supprimée avec succès.' 
      })
      
    } catch (err) {
      console.error('💥 Error deleting order:', err)
      await Swal.fire({ 
        icon: 'error', 
        title: 'Erreur', 
        text: err instanceof Error ? err.message : 'Erreur lors de la suppression de la commande' 
      })
    } finally {
      setActionLoading(null)
    }
  }

  const filtered = orders.filter(o =>
    (filterStatus === 'ALL' || o.status === filterStatus) &&
    (!query || (o.customerName || '').toLowerCase().includes(query.toLowerCase()))
  )

  const isActionLoading = (orderId: number) => actionLoading === orderId

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-playfair text-2xl">Commandes</h2>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-1 rounded-lg border border-border bg-white"
        >
          <option value="ALL">Toutes les commandes</option>
          {Object.entries(STATUS_DISPLAY).map(([value, { label }]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-golden border-t-transparent rounded-full mx-auto mb-4" />
          <div className="text-muted-foreground">Chargement des commandes...</div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {orders.length === 0 ? 'Aucune commande trouvée' : 'Aucune commande ne correspond aux filtres'}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map(order => (
            <div key={order.id} className="bg-white rounded-xl border border-border/40 overflow-hidden hover:border-border transition-colors">
              <div className="p-4">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="font-medium">{order.customerName}</h3>
                    <div className="text-sm text-muted-foreground mt-1">
                      {order.createdAt ? new Date(order.createdAt).toLocaleString('fr-FR') : 'Date inconnue'}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-full text-sm ${STATUS_DISPLAY[order.status]?.color || 'bg-gray-100 text-gray-700'}`}>
                      {STATUS_DISPLAY[order.status]?.label || order.status}
                    </div>
                    <button 
                      onClick={() => setSelectedOrder(order)} 
                      className="text-golden hover:text-golden/80"
                      disabled={isActionLoading(order.id)}
                    >
                      Détails
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div>{order.items.length} article{order.items.length > 1 ? 's' : ''}</div>
                  <div className="font-medium">{Math.round(order.totalAmount)} Ar</div>
                </div>
              </div>

              <div className="bg-background/50 px-4 py-2 flex items-center justify-end gap-2 text-sm">
                <button 
                  onClick={() => deleteOrder(order.id)} 
                  className="text-rose-600 hover:text-rose-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isActionLoading(order.id)}
                >
                  {isActionLoading(order.id) ? 'Suppression...' : 'Supprimer'}
                </button>
                {order.status === 'PENDING' && (
                  <>
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'CONFIRMED')} 
                      className="text-emerald-600 hover:text-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isActionLoading(order.id)}
                    >
                      {isActionLoading(order.id) ? '...' : 'Confirmer'}
                    </button>
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'CANCELLED')} 
                      className="text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isActionLoading(order.id)}
                    >
                      {isActionLoading(order.id) ? '...' : 'Annuler'}
                    </button>
                  </>
                )}
                {order.status === 'CONFIRMED' && (
                  <button 
                    onClick={() => updateOrderStatus(order.id, 'PREPARING')} 
                    className="text-purple-600 hover:text-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isActionLoading(order.id)}
                  >
                    {isActionLoading(order.id) ? '...' : 'Préparer'}
                  </button>
                )}
                {order.status === 'PREPARING' && (
                  <button 
                    onClick={() => updateOrderStatus(order.id, 'READY')} 
                    className="text-green-600 hover:text-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isActionLoading(order.id)}
                  >
                    {isActionLoading(order.id) ? '...' : 'Prête'}
                  </button>
                )}
                {order.status === 'READY' && (
                  <button 
                    onClick={() => updateOrderStatus(order.id, 'DELIVERED')} 
                    className="text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isActionLoading(order.id)}
                  >
                    {isActionLoading(order.id) ? '...' : 'Livrée'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-playfair text-2xl">Détails de la commande #{selectedOrder.id}</h3>
                <button onClick={() => setSelectedOrder(null)} className="text-muted-foreground hover:text-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground">Client</div>
                  <div className="font-medium">{selectedOrder.customerName}</div>
                  {selectedOrder.customerEmail && (
                    <div className="text-sm">{selectedOrder.customerEmail}</div>
                  )}
                  {selectedOrder.customerPhone && (
                    <div className="text-sm">{selectedOrder.customerPhone}</div>
                  )}
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Date de commande</div>
                  <div className="font-medium">
                    {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString('fr-FR') : 'Date inconnue'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Statut</div>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm ${STATUS_DISPLAY[selectedOrder.status]?.color || 'bg-gray-100 text-gray-700'}`}>
                    {STATUS_DISPLAY[selectedOrder.status]?.label || selectedOrder.status}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="font-medium mb-4">Articles commandés</div>
              <div className="space-y-3">
                {selectedOrder.items.length > 0 ? (
                  selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">{item.quantity} × {Math.round(item.price)} Ar</div>
                      </div>
                      <div className="font-medium">{Math.round(item.quantity * item.price)} Ar</div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-4">
                    Aucun article dans cette commande
                  </div>
                )}

                <div className="border-t border-border pt-3 flex items-center justify-between text-lg">
                  <div>Total</div>
                  <div className="font-semibold">{Math.round(selectedOrder.totalAmount)} Ar</div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border bg-background/50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Actions</div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => deleteOrder(selectedOrder.id)} 
                    className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isActionLoading(selectedOrder.id)}
                  >
                    {isActionLoading(selectedOrder.id) ? 'Suppression...' : 'Supprimer'}
                  </button>
                  {selectedOrder.status === 'PENDING' && (
                    <>
                      <button 
                        onClick={() => updateOrderStatus(selectedOrder.id, 'CONFIRMED')} 
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isActionLoading(selectedOrder.id)}
                      >
                        {isActionLoading(selectedOrder.id) ? '...' : 'Confirmer'}
                      </button>
                      <button 
                        onClick={() => updateOrderStatus(selectedOrder.id, 'CANCELLED')} 
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isActionLoading(selectedOrder.id)}
                      >
                        {isActionLoading(selectedOrder.id) ? '...' : 'Annuler'}
                      </button>
                    </>
                  )}
                  {selectedOrder.status === 'CONFIRMED' && (
                    <button 
                      onClick={() => updateOrderStatus(selectedOrder.id, 'PREPARING')} 
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isActionLoading(selectedOrder.id)}
                    >
                      {isActionLoading(selectedOrder.id) ? '...' : 'Préparer'}
                    </button>
                  )}
                  {selectedOrder.status === 'PREPARING' && (
                    <button 
                      onClick={() => updateOrderStatus(selectedOrder.id, 'READY')} 
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isActionLoading(selectedOrder.id)}
                    >
                      {isActionLoading(selectedOrder.id) ? '...' : 'Prête'}
                    </button>
                  )}
                  {selectedOrder.status === 'READY' && (
                    <button 
                      onClick={() => updateOrderStatus(selectedOrder.id, 'DELIVERED')} 
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isActionLoading(selectedOrder.id)}
                    >
                      {isActionLoading(selectedOrder.id) ? '...' : 'Livrée'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}