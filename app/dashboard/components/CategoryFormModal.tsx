'use client'

import { useState } from "react";
import Swal from 'sweetalert2';

interface Category {
    idCategory: number;
    nameCategory: string;
}

interface CategoryFormModalProps {
    category: Category | null;
    onClose: () => void;
    onSaved: () => void;
}

export default function CategoryFormModal({ category, onClose, onSaved }: CategoryFormModalProps) {
    const [form, setForm] = useState({
        nameCategory: category?.nameCategory || "",
    });

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const method = category ? "PUT" : "POST";
        const url = category
            ? `http://localhost:8080/categories/${category.idCategory}`
            : "http://localhost:8080/categories";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error("Erreur lors de l'enregistrement de la catégorie");

            Swal.fire({
                title: 'Succès!',
                text: category ? 'Catégorie modifiée avec succès' : 'Catégorie créée avec succès',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });

            onSaved();
        } catch (err) {
            console.error(err);
            
            Swal.fire({
                title: 'Erreur!',
                text: "Erreur lors de l'enregistrement de la catégorie.",
                icon: 'error',
                timer: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-card border border-border rounded-lg shadow-card w-full max-w-md p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition"
                >
                    ✕
                </button>
                <h3 className="font-playfair text-lg font-bold text-foreground mb-4">
                    {category ? "Modifier la catégorie" : "Nouvelle catégorie"}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm mb-1 text-muted-foreground">Nom de la catégorie</label>
                        <input
                            type="text"
                            value={form.nameCategory}
                            onChange={(e) => setForm({ ...form, nameCategory: e.target.value })}
                            className="w-full px-3 py-2 border border-border rounded-md bg-input focus:outline-none transition"
                            placeholder="Ex: Pains, Viennoiseries, Pâtisseries..."
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-border rounded-md hover:bg-input transition"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-foreground text-background rounded-md font-medium hover:opacity-90 transition"
                        >
                            {loading ? "Enregistrement..." : "Enregistrer"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}