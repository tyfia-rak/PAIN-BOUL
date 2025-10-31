'use client';

import { useEffect, useState } from 'react';
import { BACKEND_URL } from '@/lib/config';
import Swal from 'sweetalert2';

interface Order {
  idOrder: number;
  customerId: number;
  items: Array<{
    productId: number;
    name: string;
    price: number;
    quantity: number;
  }>;
  orderDate: string;
  status: string;
  totalAmount: number;
}

interface Customer {
  idCustomer: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export default function CommandesSection() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<{ [key: number]: Customer }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/orders`);
      if (!res.ok) throw new Error('Erreur lors du chargement des commandes');
      const ordersData: Order[] = await res.json();
      setOrders(ordersData);

      // Récupérer les informations des clients de manière plus efficace
      const uniqueCustomerIds = Array.from(
        new Set(ordersData.map((o) => o.customerId))
      );

      const customersData: { [key: number]: Customer } = {};

      // Utiliser Promise.all pour charger tous les clients en parallèle
      const customerPromises = uniqueCustomerIds.map(async (customerId) => {
        try {
          const customerRes = await fetch(
            `${BACKEND_URL}/api/customers/${customerId}`
          );
          if (customerRes.ok) {
            const customer: Customer = await customerRes.json();
            return { customerId, customer };
          }
        } catch (error) {
          console.error(`Error fetching customer ${customerId}:`, error);
        }
        return null;
      });

      const customerResults = await Promise.all(customerPromises);

      customerResults.forEach((result) => {
        if (result) {
          customersData[result.customerId] = result.customer;
        }
      });

      setCustomers(customersData);
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: 'Erreur!',
        text: 'Impossible de charger les commandes.',
        icon: 'error',
        timer: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/orders/${orderId}/status?status=${newStatus}`,
        {
          method: 'PUT',
        }
      );

      if (!res.ok) throw new Error('Erreur lors de la mise à jour du statut');

      setOrders((prev) =>
        prev.map((order) =>
          order.idOrder === orderId ? { ...order, status: newStatus } : order
        )
      );

      Swal.fire({
        title: 'Succès!',
        text: 'Statut de la commande mis à jour.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: 'Erreur!',
        text: 'Erreur lors de la mise à jour du statut.',
        icon: 'error',
        timer: 3000,
      });
    }
  };

  const deleteOrder = async (orderId: number) => {
    const result = await Swal.fire({
      title: 'Êtes-vous sûr?',
      text: 'Vous ne pourrez pas annuler cette action!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler',
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/orders/${orderId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Erreur lors de la suppression');

      setOrders((prev) => prev.filter((order) => order.idOrder !== orderId));

      Swal.fire({
        title: 'Supprimé!',
        text: 'La commande a été supprimée avec succès.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: 'Erreur!',
        text: 'Erreur lors de la suppression de la commande.',
        icon: 'error',
        timer: 3000,
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'En attente';
      case 'CONFIRMED':
        return 'Confirmée';
      case 'DELIVERED':
        return 'Livrée';
      case 'CANCELLED':
        return 'Annulée';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateItemsTotal = (items: Order['items']) => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  if (loading) {
    return (
      <section className="mt-6 bg-card border border-border rounded-lg p-6 shadow-card">
        <div className="flex items-center justify-between">
          <h2 className="font-playfair text-xl font-bold text-foreground">
            Commandes
          </h2>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Gérez les commandes clients ici.
        </p>
        <div className="mt-4 flex justify-center">
          <div className="animate-pulse text-muted-foreground">
            Chargement des commandes...
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-6 bg-card border border-border rounded-lg p-6 shadow-card">
      <div className="flex items-center justify-between">
        <h2 className="font-playfair text-xl font-bold text-foreground">
          Commandes
        </h2>
        <button
          onClick={fetchOrders}
          className="px-4 py-2 rounded-md bg-foreground text-background font-medium shadow hover:opacity-90 transition"
        >
          Actualiser
        </button>
      </div>
      <p className="text-sm text-muted-foreground mt-1">
        Gérez les commandes clients ici.
      </p>

      {orders.length === 0 ? (
        <div className="mt-6 text-center py-8">
          <p className="text-muted-foreground">Aucune commande trouvée.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {orders.map((order) => {
            const customer = customers[order.customerId];
            const itemsTotal = calculateItemsTotal(order.items);

            return (
              <div
                key={`order-${order.idOrder}`}
                className="border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">
                        Commande #{order.idOrder}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
                      >
                        {getStatusText(order.status)}
                      </span>
                    </div>

                    {customer ? (
                      <div className="space-y-1">
                        <p className="text-sm">
                          <span className="font-medium">Client:</span>{' '}
                          {customer.firstName} {customer.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {customer.email} • {customer.phone}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Chargement des informations client...
                      </p>
                    )}

                    <p className="text-xs text-muted-foreground mt-2">
                      📅 {formatDate(order.orderDate)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-xl text-golden">
                      {order.totalAmount.toFixed(0)} Ar
                    </p>
                    {itemsTotal !== order.totalAmount && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Calcul: {itemsTotal.toFixed(0)} Ar
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-3 text-foreground">
                    Produits commandés:
                  </h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div
                        key={`order-${order.idOrder}-item-${item.productId}-${index}`}
                        className="flex justify-between items-center py-2 px-3 bg-muted/30 rounded"
                      >
                        <div>
                          <span className="font-medium">{item.name}</span>
                          <span className="text-sm text-muted-foreground ml-2">
                            x {item.quantity}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-medium">
                            {(item.price * item.quantity).toFixed(0)} Ar
                          </span>
                          <p className="text-xs text-muted-foreground">
                            {item.price.toFixed(0)} Ar × {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-border">
                  <div className="flex gap-2">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(order.idOrder, e.target.value)
                      }
                      className="px-3 py-2 text-sm rounded-md border border-border bg-background focus:ring-2 focus:ring-golden/20 focus:border-golden"
                    >
                      <option value="PENDING">En attente</option>
                      <option value="CONFIRMED">Confirmée</option>
                      <option value="DELIVERED">Livrée</option>
                      <option value="CANCELLED">Annulée</option>
                    </select>

                    <button
                      onClick={() => {
                        Swal.fire({
                          title: `Détails Commande #${order.idOrder}`,
                          html: `
                                                        <div class="text-left space-y-2">
                                                            <p><strong>ID Commande:</strong> #${order.idOrder}</p>
                                                            <p><strong>Client:</strong> ${customer ? `${customer.firstName} ${customer.lastName}` : 'N/A'}</p>
                                                            <p><strong>Email:</strong> ${customer ? customer.email : 'N/A'}</p>
                                                            <p><strong>Téléphone:</strong> ${customer ? customer.phone : 'N/A'}</p>
                                                            <p><strong>Date:</strong> ${formatDate(order.orderDate)}</p>
                                                            <p><strong>Statut:</strong> ${getStatusText(order.status)}</p>
                                                            <p><strong>Total:</strong> ${order.totalAmount.toFixed(0)} Ar</p>
                                                            <div class="mt-3">
                                                                <strong>Produits:</strong>
                                                                ${order.items
                                                                  .map(
                                                                    (item) => `
                                                                    <div class="ml-2">• ${item.name} x ${item.quantity} - ${(item.price * item.quantity).toFixed(0)} Ar</div>
                                                                `
                                                                  )
                                                                  .join('')}
                                                            </div>
                                                        </div>
                                                    `,
                          icon: 'info',
                          confirmButtonText: 'Fermer',
                        });
                      }}
                      className="px-3 py-2 text-sm rounded-md border border-border hover:bg-input transition"
                    >
                      📋 Détails
                    </button>
                  </div>

                  <button
                    onClick={() => deleteOrder(order.idOrder)}
                    className="px-3 py-2 text-sm rounded-md bg-rose-600 text-white hover:opacity-90 transition"
                  >
                    🗑️ Supprimer
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
