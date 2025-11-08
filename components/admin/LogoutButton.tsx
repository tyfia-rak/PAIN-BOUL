"use client";

import { Button } from "@heroui/react";
import { signOut } from "next-auth/react";
import { useAuthStore } from "@/lib/auth/useAuthStore";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

interface LogoutButtonProps {
  className?: string;
  variant?: "solid" | "bordered" | "light" | "flat" | "faded" | "shadow" | "ghost";
  size?: "sm" | "md" | "lg";
}

export default function LogoutButton({ className = "", variant = "bordered", size = "md" }: LogoutButtonProps) {
  const { logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Déconnexion",
      text: "Êtes-vous sûr de vouloir vous déconnecter ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#C8A882",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Oui, déconnecter",
      cancelButtonText: "Annuler",
      background: "#1a1a1a",
      color: "#ffffff",
      iconColor: "#C8A882",
    });

    if (result.isConfirmed) {
      try {
        // Déconnexion du store Zustand
        await logout();

        // Déconnexion de NextAuth
        await signOut({ redirect: false });

        await Swal.fire({
          icon: "success",
          title: "À bientôt !",
          text: "Vous avez été déconnecté avec succès",
          timer: 1500,
          showConfirmButton: false,
          background: "#1a1a1a",
          color: "#ffffff",
          iconColor: "#C8A882",
        });

        // Redirection complète (pas via router.push) pour déclencher le middleware
        window.location.href = "/admin/login";
      } catch (error) {
        console.error("Logout error:", error);
        await Swal.fire({
          icon: "error",
          title: "Erreur de déconnexion",
          html: `
            <div style="text-align: center; padding: 10px;">
              <p>Une erreur est survenue lors de la déconnexion.</p>
              <p style="margin-top: 10px; font-size: 0.9em; color: #999;">Veuillez rafraîchir la page.</p>
            </div>
          `,
          confirmButtonText: "OK",
          confirmButtonColor: "#C8A882",
          background: "#1a1a1a",
          color: "#ffffff",
        });
      }
    }
  };

  return (
    <Button variant={variant} size={size} className={className} onClick={handleLogout}>
      Déconnexion
    </Button>
  );
}
