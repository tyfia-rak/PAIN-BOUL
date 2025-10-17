'use client'

import { useEffect, useState } from "react";

interface Order {
  idOrder: number;
  customer: string;
  total: number;
  status: "EN_ATTENTE" | "EN_LIVRAISON" | "LIVRÉ" | "ANNULÉ";
  date: string;
}

export default function CommandesSection({ query }: { query: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fake: Order[] = [
      { idOrder: 1, customer: "Marie Dupont", total: 45.6, status: "LIVRÉ", date: "2025-10-10" },
      { idOrder: 2, customer: "Jean Rabe", total: 28.4, status: "EN_LIVRAISON", date: "2025-10-13" },
      { idOrder: 3, customer: "Aina Rakoto", total: 60.2, status: "EN_ATTENTE", date: "2025-10-15" },
    ];
    setOrders(fake);
    setLoading(false);
  }, []);

  const filtered = orders.filter((o) =>
    o.customer.toLowerCase().includes(query.toLowerCase())
  );

  const statusColor = (status: Order["status"]) => {
    switch (status) {
      case "LIVRÉ": return "bg-green-100 text-green-700";
      case "EN_LIVRAISON": return "bg-blue-100 text-blue-700";
      case "EN_ATTENTE": return "bg-yellow-100 text-yellow-700";
      case "ANNULÉ": return "bg-rose-100 text-rose-700";
    }
  };

  return (
    <section className="mt-6 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h2 className="font-playfair text-xl font-bold text-gray-800">Commandes</h2>
      <p className="text-sm text-gray-500 mt-1">Suivi des commandes clients</p>

      {loading ? (
        <p className="mt-4 text-gray-400">Chargement...</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 text-left border-b border-gray-200">
                <th className="py-2 font-medium">N°</th>
                <th className="py-2 font-medium">Client</th>
                <th className="py-2 font-medium">Date</th>
                <th className="py-2 font-medium">Montant</th>
                <th className="py-2 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.length > 0 ? (
                filtered.map((o) => (
                  <tr key={o.idOrder}>
                    <td className="py-2">{o.idOrder}</td>
                    <td>{o.customer}</td>
                    <td>{new Date(o.date).toLocaleDateString()}</td>
                    <td>€ {o.total.toFixed(2)}</td>
                    <td>
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${statusColor(o.status)}`}
                      >
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-400">
                    Aucune commande trouvée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
