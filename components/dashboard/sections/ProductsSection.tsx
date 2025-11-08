"use client";

import { useEffect, useState } from "react";
import ProductFormModal from "@/components/dashboard/ProductFormModal";
import { BACKEND_URL } from "@/lib/config/backend";
import Swal from "sweetalert2";

interface Product {
  idProduct: number;
  name: string;
  price: number;
  image: string;
  categoryName: string;
}

export default function ProductsSection({ query }: { query: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/products`);
      if (!res.ok) throw new Error("Erreur lors du chargement des produits");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Erreur!",
        text: "Impossible de charger les produits.",
        icon: "error",
        timer: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (idProduct: number) => {
    const result = await Swal.fire({
      title: "Êtes-vous sûr?",
      text: "Vous ne pourrez pas annuler cette action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer!",
      cancelButtonText: "Annuler",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`${BACKEND_URL}/products/${idProduct}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erreur lors de la suppression");
      setProducts(products.filter((p) => p.idProduct !== idProduct));

      Swal.fire({
        title: "Supprimé!",
        text: "Le produit a été supprimé avec succès.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Erreur!",
        text: "Erreur lors de la suppression du produit.",
        icon: "error",
        timer: 3000,
      });
    }
  };

  const filtered = products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));

  const getImageUrl = (imagePath: string) => {
    if (!imagePath || imagePath.trim() === "") {
      return null;
    }
    if (imagePath.startsWith("http")) return imagePath;
    return `${BACKEND_URL}${imagePath}`;
  };

  const placeholderImage =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'%3E%3C/circle%3E%3Cpolyline points='21,15 16,10 5,21'%3E%3C/polyline%3E%3C/svg%3E";

  return (
    <section className="mt-6 bg-card border border-border rounded-lg p-6 shadow-card">
      <div className="flex items-center justify-between">
        <h2 className="font-playfair text-xl font-bold text-foreground">Produits</h2>
        <button
          onClick={() => {
            setEditingProduct(null);
            setShowModal(true);
          }}
          className="px-4 py-2 rounded-md bg-foreground text-background font-medium shadow hover:opacity-90 transition"
        >
          Nouveau produit
        </button>
      </div>
      <p className="text-sm text-muted-foreground mt-1">Gérez vos produits ici.</p>

      {loading ? (
        <p className="mt-4 text-muted-foreground">Chargement...</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground text-left">
                <th className="py-2 font-medium">Image</th>
                <th className="py-2 font-medium">Nom</th>
                <th className="py-2 font-medium">Prix</th>
                <th className="py-2 font-medium">Catégorie</th>
                <th className="py-2 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length > 0 ? (
                filtered.map((p) => {
                  const imageUrl = getImageUrl(p.image);

                  return (
                    <tr key={`product-${p.idProduct}`}>
                      <td className="py-3">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={p.name}
                            className="w-12 h-12 object-cover rounded-md"
                            onError={(e) => {
                              e.currentTarget.src = placeholderImage;
                            }}
                          />
                        ) : (
                          <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                            <span className="text-xs text-muted-foreground">No img</span>
                          </div>
                        )}
                      </td>
                      <td>{p.name}</td>
                      <td>{p.price.toFixed(2)} Ar </td>
                      <td>{p.categoryName}</td>
                      <td className="text-right">
                        <button
                          onClick={() => {
                            setEditingProduct(p);
                            setShowModal(true);
                          }}
                          className="px-3 py-1 text-xs rounded-md border border-border hover:bg-input mr-2 transition"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(p.idProduct)}
                          className="px-3 py-1 text-xs rounded-md bg-rose-600 text-white hover:opacity-90 transition"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-muted-foreground">
                    Aucun produit trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <ProductFormModal
          product={editingProduct}
          onClose={() => setShowModal(false)}
          onSaved={() => {
            setShowModal(false);
            fetchProducts();
          }}
        />
      )}
    </section>
  );
}
