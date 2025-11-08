"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { BACKEND_URL } from "@/lib/config/backend";
import Swal from "sweetalert2";

interface OrderFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  deliveryTime: string;
  notes: string;
}

export default function OrderFormModal({ onClose }: { onClose: () => void }) {
  const { items, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState<any | null>(null);
  const [formData, setFormData] = useState<OrderFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    deliveryTime: "",
    notes: "",
  });

  useEffect(() => {
    const searchCustomer = async () => {
      if (!formData.email) return;

      try {
        const res = await fetch(`${BACKEND_URL}/api/customers/email/${encodeURIComponent(formData.email)}`);
        if (res.ok) {
          const foundCustomer = await res.json();
          setCustomer(foundCustomer);
          setFormData((prev) => ({
            ...prev,
            firstName: foundCustomer.firstName,
            lastName: foundCustomer.lastName,
            phone: foundCustomer.phone,
            address: foundCustomer.address,
          }));
        } else {
          setCustomer(null);
        }
      } catch (error) {
        console.error("Error searching for customer:", error);
      }
    };

    const timeoutId = setTimeout(searchCustomer, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.email]);

  const createOrUpdateCustomer = async (): Promise<any> => {
    const customerData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
    };

    const url = customer ? `${BACKEND_URL}/api/customers/${customer.idCustomer}` : `${BACKEND_URL}/api/customers`;

    const method = customer ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customerData),
    });

    if (!res.ok) throw new Error("Failed to save customer data");
    return res.json();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const validItems = items.filter((item) => item && item.product && item.product.idProduct && item.quantity > 0);

    if (validItems.length === 0) {
      setLoading(false);
      await Swal.fire({
        icon: "warning",
        title: "Panier vide",
        text: "Votre panier est vide ou contient des produits invalides",
        background: "hsl(var(--background))",
        color: "hsl(var(--foreground))",
        confirmButtonColor: "hsl(var(--golden))",
      });
      return;
    }

    try {
      const savedCustomer = await createOrUpdateCustomer();

      const orderDTO = {
        customerId: savedCustomer.idCustomer,
        items: validItems.map((item) => ({
          productId: item.product.idProduct,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
        })),
        orderDate: new Date().toISOString(),
        status: "PENDING",
        totalAmount: totalPrice,
      };

      const orderRes = await fetch(`${BACKEND_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderDTO),
      });

      if (!orderRes.ok) {
        const errorText = await orderRes.text();
        throw new Error(`Failed to submit order: ${errorText}`);
      }

      const order = await orderRes.json();

      clearCart();
      onClose();
      await Swal.fire({
        icon: "success",
        title: "Commande enregistrée",
        text: "Votre commande a été enregistrée avec succès !",
        background: "hsl(var(--background))",
        color: "hsl(var(--foreground))",
        confirmButtonColor: "hsl(var(--golden))",
      });
    } catch (error) {
      console.error("Error submitting order:", error);
      await Swal.fire({
        icon: "error",
        title: "Erreur",
        text: error instanceof Error ? error.message : "Une erreur est survenue lors de l'envoi de votre commande. Veuillez réessayer.",
        background: "hsl(var(--background))",
        color: "hsl(var(--foreground))",
        confirmButtonColor: "hsl(var(--golden))",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-4 animate-fade-in">
      <div
        className="bg-background border border-golden/20 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-golden/20 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header avec gradient */}
        <div className="relative p-8 border-b border-golden/10 bg-gradient-to-r from-background via-background to-golden/5">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-golden to-transparent"></div>

          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-playfair text-3xl text-foreground mb-2">Finaliser votre commande</h2>
              <p className="text-muted-foreground font-inter">Remplissez vos informations pour confirmer</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-golden/10 rounded-full transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Résumé de commande */}
          <div className="mt-6 p-4 bg-background/50 rounded-xl border border-golden/10">
            <p className="font-inter font-semibold text-foreground mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-golden" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                  clipRule="evenodd"
                />
              </svg>
              Votre commande ({items.length} produit
              {items.length > 1 ? "s" : ""})
            </p>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {items.map((item, index) => (
                <div key={index} className="flex justify-between items-center font-inter text-sm">
                  <span className="text-foreground">
                    {item.product.name} × {item.quantity}
                  </span>
                  <span className="font-semibold text-golden">{(item.product.price * item.quantity).toFixed(0)} Ar</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nom et Prénom */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-inter font-medium text-foreground mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-golden" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  Nom
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData((d) => ({ ...d, lastName: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border border-golden/20 bg-background/50 text-foreground placeholder-muted-foreground focus:border-golden focus:ring-2 focus:ring-golden/20 transition-all duration-200 font-inter"
                  placeholder="Votre nom"
                />
              </div>
              <div>
                <label className="block font-inter font-medium text-foreground mb-3 flex items-center gap-2">Prénom</label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData((d) => ({ ...d, firstName: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border border-golden/20 bg-background/50 text-foreground placeholder-muted-foreground focus:border-golden focus:ring-2 focus:ring-golden/20 transition-all duration-200 font-inter"
                  placeholder="Votre prénom"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block font-inter font-medium text-foreground mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-golden" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                Email
                {customer && (
                  <span className="ml-2 text-xs text-golden font-normal bg-golden/10 px-2 py-1 rounded-full">✓ Client existant</span>
                )}
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData((d) => ({ ...d, email: e.target.value }))}
                className={`w-full px-4 py-3 rounded-lg border bg-background/50 text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-golden/20 transition-all duration-200 font-inter ${
                  customer ? "border-golden bg-golden/5" : "border-golden/20 focus:border-golden"
                }`}
                placeholder="votre@email.com"
              />
            </div>

            {/* Téléphone */}
            <div>
              <label className="block font-inter font-medium text-foreground mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-golden" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                Téléphone
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData((d) => ({ ...d, phone: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg border border-golden/20 bg-background/50 text-foreground placeholder-muted-foreground focus:border-golden focus:ring-2 focus:ring-golden/20 transition-all duration-200 font-inter"
                placeholder="Votre numéro"
              />
            </div>

            {/* Heure de livraison */}
            <div>
              <label className="block font-inter font-medium text-foreground mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-golden" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                Heure de livraison
              </label>
              <input
                type="time"
                required
                value={formData.deliveryTime}
                onChange={(e) => setFormData((d) => ({ ...d, deliveryTime: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg border border-golden/20 bg-background/50 text-foreground focus:border-golden focus:ring-2 focus:ring-golden/20 transition-all duration-200 font-inter"
              />
            </div>
          </div>

          {/* Adresse */}
          <div>
            <label className="block font-inter font-medium text-foreground mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-golden" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              Adresse de livraison
            </label>
            <textarea
              required
              value={formData.address}
              onChange={(e) => setFormData((d) => ({ ...d, address: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-golden/20 bg-background/50 text-foreground placeholder-muted-foreground focus:border-golden focus:ring-2 focus:ring-golden/20 transition-all duration-200 font-inter resize-none"
              placeholder="Votre adresse complète"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block font-inter font-medium text-foreground mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-golden" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              Notes supplémentaires
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData((d) => ({ ...d, notes: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-golden/20 bg-background/50 text-foreground placeholder-muted-foreground focus:border-golden focus:ring-2 focus:ring-golden/20 transition-all duration-200 font-inter resize-none"
              placeholder="Instructions spéciales, allergies, etc."
            />
          </div>

          {/* Total et bouton de confirmation */}
          <div className="border-t border-golden/10 pt-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="font-playfair text-2xl font-semibold text-foreground">Total</span>
                <p className="text-muted-foreground text-sm font-inter mt-1">TVA incluse</p>
              </div>
              <div className="text-right">
                <span className="font-playfair text-3xl font-bold text-golden">{totalPrice.toFixed(0)} Ar</span>
                <p className="text-muted-foreground text-sm font-inter mt-1">
                  {items.length} article{items.length > 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || items.length === 0}
              className="w-full gradient-golden text-charcoal font-semibold py-4 rounded-lg hover:brightness-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-golden font-inter text-lg relative overflow-hidden group"
            >
              <span className="relative z-10">
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin"></div>
                    Envoi en cours...
                  </div>
                ) : (
                  "Confirmer la commande"
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
