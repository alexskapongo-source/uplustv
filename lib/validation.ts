import { z } from "zod";

/* ============================================================
   SCHEMAS DE VALIDATION
   Partages entre le client (retour immediat dans le formulaire)
   et le serveur (source de verite). Le serveur revalide
   systematiquement : la validation client n'est qu'un confort.
   ============================================================ */

const trimmed = (min: number, max: number) =>
  z
    .string()
    .trim()
    .min(min, { message: `Ce champ doit contenir au moins ${min} caractères.` })
    .max(max, { message: `Ce champ ne peut pas dépasser ${max} caractères.` });

/**
 * Numero de telephone : format volontairement permissif pour
 * accepter les usages congolais (+243, 0..., espaces, tirets),
 * mais assez strict pour rejeter une saisie incoherente.
 */
export const phoneSchema = z
  .string()
  .trim()
  .min(9, { message: "Numéro trop court." })
  .max(20, { message: "Numéro trop long." })
  .regex(/^\+?[0-9][0-9\s().-]{7,}$/, {
    message: "Entrez un numéro valide, par exemple +243 000 000 000.",
  });

export const optionalPhoneSchema = z
  .union([phoneSchema, z.literal("")])
  .transform((value) => (value === "" ? null : value));

export const optionalEmailSchema = z
  .union([
    z.string().trim().email({ message: "Entrez une adresse e-mail valide." }),
    z.literal(""),
  ])
  .transform((value) => (value === "" ? null : value));

export const CONTACT_SUBJECTS = [
  "Abonnement",
  "Paiement",
  "Stickfire",
  "Installation",
  "Application",
  "Problème technique",
  "Réclamation",
  "Témoignage",
  "Autre",
] as const;

export const contactSchema = z.object({
  fullName: trimmed(2, 80),
  phone: phoneSchema,
  whatsapp: optionalPhoneSchema,
  email: optionalEmailSchema,
  subject: z.enum(CONTACT_SUBJECTS, {
    errorMap: () => ({ message: "Choisissez un sujet." }),
  }),
  message: trimmed(10, 2000),
  consent: z.literal(true, {
    errorMap: () => ({
      message: "Vous devez accepter la politique de confidentialité pour continuer.",
    }),
  }),
  /**
   * Champ piege anti-robot. Volontairement NON contraint ici : s'il
   * etait rejete par la validation, le robot saurait qu'il a echoue.
   * C'est la route qui decide quoi en faire, silencieusement.
   */
  company: z.string().optional().default(""),
});

export type ContactInput = z.input<typeof contactSchema>;

export const paymentMethodSchema = z.enum([
  "airtel-money",
  "orange-money",
  "m-pesa",
  "card",
]);

export const subscriptionSchema = z.object({
  planSlug: z.string().min(1),
  fullName: trimmed(2, 80),
  phone: phoneSchema,
  whatsapp: optionalPhoneSchema,
  email: optionalEmailSchema,
  method: paymentMethodSchema,
  company: z.string().optional().default(""),
});

export type SubscriptionInput = z.input<typeof subscriptionSchema>;

export const orderSchema = z.object({
  productSlug: z.string().min(1),
  quantity: z.coerce.number().int().min(1).max(10),
  fullName: trimmed(2, 80),
  phone: phoneSchema,
  whatsapp: optionalPhoneSchema,
  email: optionalEmailSchema,
  city: trimmed(2, 60),
  address: trimmed(5, 200),
  notes: z
    .union([z.string().trim().max(500), z.literal("")])
    .transform((value) => (value === "" ? null : value)),
  method: paymentMethodSchema,
  company: z.string().optional().default(""),
});

export type OrderInput = z.input<typeof orderSchema>;

export const loginSchema = z.object({
  phone: phoneSchema,
  password: z
    .string()
    .min(6, { message: "Le mot de passe doit contenir au moins 6 caractères." })
    .max(100),
});

export type LoginInput = z.input<typeof loginSchema>;

/** Convertit une erreur zod en dictionnaire champ -> message. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !result[key]) {
      result[key] = issue.message;
    }
  }
  return result;
}
