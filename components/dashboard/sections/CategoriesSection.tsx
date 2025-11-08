"use client";

import { useEffect, useState } from "react";
import { BACKEND_URL } from "@/lib/config/backend";
import CategoryFormModal from "@/components/dashboard/CategoryFormModal";
import Swal from "sweetalert2";

interface Category {
  idCategory: number;
  nameCategory: string;
}

interface CategoriesSectionProps {
  query?: string;
}

export default function CategoriesSection({ query = "" }: CategoriesSectionProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/categories`);
      if (!res.ok) throw new Error("Erreur lors du chargement des catégories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Erreur!",
        text: "Impossible de charger les catégories.",
        icon: "error",
        timer: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Êtes-vous sûr?",
      text: "Cette action est irréversible!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer!",
      cancelButtonText: "Annuler",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`${BACKEND_URL}/categories/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erreur lors de la suppression");
      setCategories(categories.filter((c) => c.idCategory !== id));

      Swal.fire({
        title: "Supprimé!",
        text: "La catégorie a été supprimée avec succès.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Erreur!",
        text: "Erreur lors de la suppression de la catégorie.",
        icon: "error",
        timer: 3000,
      });
    }
  };

  const filtered = categories.filter(
    (category) => category.nameCategory.toLowerCase().includes(query.toLowerCase()) || category.idCategory.toString().includes(query)
  );

  return (
    <section className="mt-6 bg-card border border-border rounded-lg p-6 shadow-card">
      <div className="flex items-center justify-between">
        <h2 className="font-playfair text-xl font-bold text-foreground">Catégories</h2>
        <button
          onClick={() => {
            setEditingCategory(null);
            setShowModal(true);
          }}
          className="px-4 py-2 rounded-md bg-foreground text-background font-medium shadow hover:opacity-90 transition"
        >
          Nouvelle catégorie
        </button>
      </div>
      <p className="text-sm text-muted-foreground mt-1">Gérez vos catégories de produits ici.</p>

      {loading ? (
        <p className="mt-4 text-muted-foreground">Chargement des catégories...</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground text-left">
                <th className="py-2 font-medium">ID</th>
                <th className="py-2 font-medium">Nom</th>
                <th className="py-2 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length > 0 ? (
                filtered.map((category) => (
                  <tr key={`category-${category.idCategory}`}>
                    <td className="py-3">{category.idCategory}</td>
                    <td className="font-medium">{category.nameCategory}</td>
                    <td className="text-right">
                      <button
                        onClick={() => {
                          setEditingCategory(category);
                          setShowModal(true);
                        }}
                        className="px-3 py-1 text-xs rounded-md border border-border hover:bg-input mr-2 transition"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(category.idCategory)}
                        className="px-3 py-1 text-xs rounded-md bg-rose-600 text-white hover:opacity-90 transition"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-muted-foreground">
                    Aucune catégorie trouvée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <CategoryFormModal
          category={editingCategory}
          onClose={() => setShowModal(false)}
          onSaved={() => {
            setShowModal(false);
            fetchCategories();
          }}
        />
      )}
    </section>
  );
}
