'use client'

import React, { useState, useEffect } from 'react'
import { useCart } from '../CartProvider'
import { BACKEND_URL } from '@/lib/config'
import { Customer } from '@/types'
import Swal from 'sweetalert2'

interface OrderFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  deliveryTime: string
  notes: string
}

export default function OrderFormModal({ onClose }: { onClose: () => void }) {
  const { items, totalPrice, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [formData, setFormData] = useState<OrderFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    deliveryTime: '',
    notes: ''
  })

  // Chercher le client quand l'email change
  useEffect(() => {
    const searchCustomer = async () => {
      if (!formData.email) return

      try {
        const res = await fetch(`${BACKEND_URL}/api/customers/email/${encodeURIComponent(formData.email)}`)
        if (res.ok) {
          const foundCustomer = await res.json()
          setCustomer(foundCustomer)
          // Pré-remplir les champs avec les informations du client
          setFormData(prev => ({
            ...prev,
            firstName: foundCustomer.firstName,
            lastName: foundCustomer.lastName,
            phone: foundCustomer.phone,
            address: foundCustomer.address
          }))
        } else {
          setCustomer(null)
        }
      } catch (error) {
        console.error('Error searching for customer:', error)
      }
    }

    // Debounce la recherche pour éviter trop d'appels API
    const timeoutId = setTimeout(searchCustomer, 500)
    return () => clearTimeout(timeoutId)
  }, [formData.email])

  const createOrUpdateCustomer = async (): Promise<Customer> => {
    const customerData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address
    }

    const url = customer
      ? `${BACKEND_URL}/api/customers/${customer.idCustomer}`
      : `${BACKEND_URL}/api/customers`
    
    const method = customer ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customerData)
    })

    if (!res.ok) throw new Error('Failed to save customer data')
    return res.json()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (items.length === 0) {
      setLoading(false)
      await Swal.fire({ icon: 'warning', title: 'Panier vide', text: 'Votre panier est vide' })
      return
    }

    try {
      // D'abord créer ou mettre à jour le client
      const savedCustomer = await createOrUpdateCustomer()

      // Send detailed items so the backend stores snapshots (name, price, quantity)
      const orderDTO = {
        customerId: savedCustomer.idCustomer,
        productIds: items.map(item => item.product.idProduct),
        orderDate: new Date().toISOString(),
        status: "PENDING",
        totalAmount: totalPrice
      }

      const orderRes = await fetch(`${BACKEND_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderDTO)
      })

      if (!orderRes.ok) throw new Error('Failed to submit order')

      const order = await orderRes.json()
      clearCart()
      onClose()
      await Swal.fire({ icon: 'success', title: 'Commande enregistrée', text: 'Votre commande a été enregistrée avec succès !' })
      // Optionnel : rediriger vers une page de confirmation
      // window.location.href = `/order/${order.id}`
    } catch (error) {
      console.error('Error submitting order:', error)
      await Swal.fire({ icon: 'error', title: 'Erreur', text: 'Une erreur est survenue lors de l\'envoi de votre commande. Veuillez réessayer.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-playfair text-2xl">Finaliser votre commande</h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-muted-foreground">Veuillez remplir les informations suivantes pour confirmer votre commande</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Nom</label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={e => setFormData(d => ({ ...d, lastName: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-golden/20 focus:border-golden"
                  placeholder="Nom de famille"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Prénom</label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={e => setFormData(d => ({ ...d, firstName: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-golden/20 focus:border-golden"
                  placeholder="Prénom"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Email
                {customer && (
                  <span className="ml-2 text-xs text-emerald-600 font-normal">
                    Client existant trouvé
                  </span>
                )}
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData(d => ({ ...d, email: e.target.value }))}
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-golden/20 ${
                  customer 
                    ? 'border-emerald-300 bg-emerald-50/50' 
                    : 'border-border'
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Téléphone</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={e => setFormData(d => ({ ...d, phone: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-golden/20 focus:border-golden"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Heure de livraison souhaitée</label>
              <input
                type="time"
                required
                value={formData.deliveryTime}
                onChange={e => setFormData(d => ({ ...d, deliveryTime: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-golden/20 focus:border-golden"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Adresse de livraison</label>
            <textarea
              required
              value={formData.address}
              onChange={e => setFormData(d => ({ ...d, address: e.target.value }))}
              rows={2}
              className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-golden/20 focus:border-golden"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Notes supplémentaires</label>
            <textarea
              value={formData.notes}
              onChange={e => setFormData(d => ({ ...d, notes: e.target.value }))}
              rows={2}
              className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-golden/20 focus:border-golden"
              placeholder="Instructions spéciales, allergies, etc."
            />
          </div>

          <div className="border-t border-border pt-6">
            <div className="flex items-center justify-between mb-6">
              <span className="text-lg font-medium">Total</span>
              <span className="text-xl font-semibold text-golden">{totalPrice.toFixed(0)} Ar</span>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-golden text-charcoal font-semibold py-3 rounded-lg hover:brightness-105 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? 'Envoi en cours...' : 'Confirmer la commande'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}