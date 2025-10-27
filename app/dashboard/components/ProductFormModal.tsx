'use client'

import { useState, useEffect, useRef } from "react";
import { BACKEND_URL } from '@/lib/config'
import Swal from 'sweetalert2';

interface Category {
    idCategory: number;
    nameCategory: string;
}

interface Product {
    idProduct?: number;
    name: string;
    price: number;
    image: string;
    categoryName: string;
}

interface ProductFormModalProps {
    product: Product | null;
    onClose: () => void;
    onSaved: () => void;
}

export default function ProductFormModal({ product, onClose, onSaved }: ProductFormModalProps) {
    const [form, setForm] = useState({
        name: product?.name || "",
        price: product?.price || 0,
        image: product?.image || "",
        categoryName: product?.categoryName || "",
    });

    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>(
        product?.image 
            ? product.image.startsWith('http') 
                ? product.image 
                : `${BACKEND_URL}${product.image}`
            : ""
    );
    const fileInputRef = useRef<HTMLInputElement>(null);

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
                title: 'Erreur!',
                text: 'Impossible de charger les catégories.',
                icon: 'error',
                timer: 3000
            });
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                Swal.fire({
                    title: 'Format invalide',
                    text: 'Veuillez sélectionner un fichier image valide',
                    icon: 'warning',
                    timer: 3000
                });
                return;
            }

            if (file.size > 10 * 1024 * 1024) {
                Swal.fire({
                    title: 'Fichier trop lourd',
                    text: 'L\'image ne doit pas dépasser 10MB',
                    icon: 'warning',
                    timer: 3000
                });
                return;
            }

            setSelectedFile(file);
            
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadImage = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`${BACKEND_URL}/api/upload/image`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erreur upload: ${response.status} - ${errorText}`);
        }

        const imagePath = await response.text();
        return imagePath;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!form.categoryName) {
            Swal.fire({
                title: 'Champ manquant',
                text: 'Veuillez sélectionner une catégorie',
                icon: 'warning',
                timer: 3000
            });
            return;
        }

        setLoading(true);

        try {
            let imageUrl = form.image;

            if (selectedFile) {
                setUploading(true);
                imageUrl = await uploadImage(selectedFile);
                setUploading(false);
            }

            const method = product ? "PUT" : "POST";
            const url = product
                ? `${BACKEND_URL}/products/${product.idProduct}`
                : `${BACKEND_URL}/products`;

            const body = {
                name: form.name,
                price: form.price,
                image: imageUrl,
                categoryName: form.categoryName
            };

            console.log("Envoi des données:", body);

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Erreur serveur (${res.status}): ${errorText}`);
            }

            Swal.fire({
                title: 'Succès!',
                text: product ? 'Produit modifié avec succès' : 'Produit créé avec succès',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });

            onSaved();
        } catch (err: unknown) {
            console.error("Erreur détaillée:", err);
            
            Swal.fire({
                title: 'Erreur!',
                text: err instanceof Error ? err.message : "Erreur inconnue lors de l'enregistrement",
                icon: 'error',
                timer: 4000
            });
        } finally {
            setLoading(false);
            setUploading(false);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const removeImage = () => {
        setSelectedFile(null);
        setImagePreview("");
        setForm({ ...form, image: "" });
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-card border border-border rounded-lg shadow-card w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-muted-foreground hover:text-foreground z-10"
                    disabled={loading}
                >
                    ✕
                </button>
                <h3 className="font-playfair text-lg font-bold text-foreground mb-4">
                    {product ? "Modifier le produit" : "Nouveau produit"}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm mb-1 text-muted-foreground">Nom du produit</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full px-3 py-2 border border-border rounded-md bg-input focus:outline-none"
                            required
                            placeholder="Ex: Pain au chocolat, Croissant..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1 text-muted-foreground">Prix (Ar)</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={form.price}
                            onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-border rounded-md bg-input focus:outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1 text-muted-foreground">Image du produit</label>
                        
                        <div 
                            onClick={triggerFileInput}
                            className="border-2 border-dashed border-border rounded-md p-4 text-center cursor-pointer hover:bg-input transition"
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                accept="image/*"
                                className="hidden"
                            />
                            
                            {imagePreview ? (
                                <div className="relative">
                                    <img 
                                        src={imagePreview} 
                                        alt="Preview" 
                                        className="mx-auto max-h-32 object-cover rounded-md"
                                    />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeImage();
                                        }}
                                        className="absolute top-2 right-2 bg-rose-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <div className="text-4xl text-muted-foreground mb-2">📁</div>
                                    <p className="text-sm text-muted-foreground">
                                        Cliquez pour sélectionner une image
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        PNG, JPG, JPEG jusqu'à 10MB
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm mb-1 text-muted-foreground">Catégorie</label>
                        <select
                            value={form.categoryName}
                            onChange={(e) => setForm({ ...form, categoryName: e.target.value })}
                            className="w-full px-3 py-2 border border-border rounded-md bg-input focus:outline-none"
                            required
                        >
                            <option value="">Choisir une catégorie...</option>
                            {categories.map((category) => (
                                <option 
                                    key={`cat-${category.idCategory}`} 
                                    value={category.nameCategory}
                                >
                                    {category.nameCategory}
                                </option>
                            ))}
                        </select>
                        {categories.length === 0 && (
                            <p className="text-xs text-amber-600 mt-1">
                                Aucune catégorie disponible. Créez d'abord des catégories.
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-border rounded-md hover:bg-input transition"
                            disabled={loading}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={loading || uploading || categories.length === 0}
                            className="px-4 py-2 bg-foreground text-background rounded-md font-medium hover:opacity-90 transition disabled:opacity-50"
                        >
                            {uploading ? "Upload de l'image..." : loading ? "Enregistrement..." : "Enregistrer"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}