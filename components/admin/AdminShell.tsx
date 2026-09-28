"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent, ReactNode } from "react";

import { IrisMark } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { Icon, type IconName } from "@/components/ui/Icon";

/* ============================================================
   COQUE DE L'ESPACE D'ADMINISTRATION
   ------------------------------------------------------------
   Tant que la session n'est pas ouverte, RIEN du contenu n'est
   rendu : l'ecran de connexion remplace entierement l'interface.
   La verification est faite cote serveur (cf. layout.tsx), le
   client ne fait que refleter son resultat.
   ============================================================ */

const NAV: { label: string; href: string; icon: IconName }[] = [
  { label: "Tableau de bord", href: "/admin", icon: "channels" },
  { label: "Abonnements", href: "/admin/abonnements", icon: "user" },
  { label: "Commandes", href: "/admin/commandes", icon: "remote" },
  { label: "Messages", href: "/admin/messages", icon: "mail" },
  { label: "Contenus à compléter", href: "/admin/contenus", icon: "alert" },
  { label: "Chaînes", href: "/admin/chaines", icon: "quality" },
  { label: "Offres", href: "/admin/offres", icon: "star" },
  { label: "Agences", href: "/admin/agences", icon: "pin" },
  { label: "Aide", href: "/admin/faq", icon: "info" },
];

function LoginScreen() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage(null);

    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { message?: string }
          | null;
        setStatus("error");
        setMessage(payload?.message ?? "Accès refusé.");
        return;
      }

      setPassword("");
      router.refresh();
    } catch {
      setStatus("error");
      setMessage("Le serveur n'a pas répondu. Réessayez.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <IrisMark size={26} className="text-champagne" />

        <h1 className="u-display-sm mt-7 text-ivory">Administration</h1>
        <p className="mt-3 text-[0.875rem] leading-relaxed text-ash">
          Cet espace est réservé à l&apos;équipe Univers+.
        </p>

        <form onSubmit={submit} className="mt-9 flex flex-col gap-5">
          <TextField
            label="Mot de passe"
            type="password"
            autoComplete="current-password"
            tone="dark"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            error={status === "error" ? (message ?? undefined) : undefined}
          />

          <Button
            type="submit"
            tone="dark"
            variant="primary"
            size="lg"
            fullWidth
            loading={status === "sending"}
            loadingLabel="Vérification…"
          >
            Ouvrir la session
          </Button>
        </form>

        <p className="mt-8 text-[0.75rem] leading-relaxed text-ash/70">
          Session valable 8 heures. Le mot de passe et la clé de signature se
          configurent par variables d&apos;environnement.
        </p>
      </div>
    </div>
  );
}

export function AdminShell({
  authenticated,
  children,
}: {
  authenticated: boolean;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  if (!authenticated) return <LoginScreen />;

  async function signOut() {
    await fetch("/api/admin/session", { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* ---------------- Navigation ---------------- */}
      <aside className="border-b border-smoke bg-ink lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-2.5 px-6 py-6">
          <IrisMark size={17} className="text-champagne" />
          <span className="font-display text-lg text-ivory">Univers+</span>
          <span className="ml-auto text-[0.625rem] uppercase tracking-[0.16em] text-ash">
            Admin
          </span>
        </div>

        <nav aria-label="Navigation de l'administration" className="px-3 pb-5">
          <ul className="flex flex-wrap gap-1 lg:flex-col">
            {NAV.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-3 rounded-[6px] px-3 py-2.5 text-[0.8125rem] transition-colors duration-200 ${
                      active
                        ? "bg-slate text-champagne"
                        : "text-ash hover:bg-slate/60 hover:text-ivory"
                    }`}
                  >
                    <Icon name={item.icon} size={16} className="shrink-0" />
                    <span className="whitespace-nowrap">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-smoke px-3 py-4 lg:mt-auto">
          <ul className="flex flex-wrap gap-1 lg:flex-col">
            <li>
              <Link
                href="/fr"
                className="flex items-center gap-3 rounded-[6px] px-3 py-2.5 text-[0.8125rem] text-ash transition-colors duration-200 hover:bg-slate/60 hover:text-ivory"
              >
                <Icon name="arrow-left" size={16} className="shrink-0" />
                Retour au site
              </Link>
            </li>
            <li>
              <button
                type="button"
                onClick={signOut}
                className="flex w-full cursor-pointer items-center gap-3 rounded-[6px] px-3 py-2.5 text-left text-[0.8125rem] text-ash transition-colors duration-200 hover:bg-slate/60 hover:text-ivory"
              >
                <Icon name="lock" size={16} className="shrink-0" />
                Fermer la session
              </button>
            </li>
          </ul>
        </div>
      </aside>

      <main className="flex-1 bg-graphite px-6 py-10 md:px-10 md:py-12">{children}</main>
    </div>
  );
}
