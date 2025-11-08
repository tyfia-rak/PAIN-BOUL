// Types de base pour les modèles de données

export interface Product {
  idProduct: number;
  name: string;
  description?: string;
  price?: number;
  image?: string;
  imageUrl?: string;
  idCategory?: number;
  categoryName?: string;
}

export interface Category {
  idCategory: number;
  nameCategory: string;
}

export interface Customer {
  idCustomer: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}
