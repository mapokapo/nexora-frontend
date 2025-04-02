import { clsx, type ClassValue } from "clsx";
import { FirebaseError } from "firebase/app";
import { Timestamp } from "firebase/firestore";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isFirebaseError(error: unknown): error is FirebaseError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "message" in error
  );
}

export function mapError(error: unknown) {
  if (typeof error === "string") {
    return error;
  }

  if (isFirebaseError(error)) {
    switch (error.code) {
      case "auth/invalid-credential":
        return "Račun s tim podacima ne postoji.";
      case "auth/email-already-in-use":
        return "Email adresa je već u upotrebi.";
      default:
        return error.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Nepoznata greška.";
}

export function getRelativeTime(d1: Date, d2 = new Date()) {
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const units: Record<string, number> = {
    year: 24 * 60 * 60 * 1000 * 365,
    month: (24 * 60 * 60 * 1000 * 365) / 12,
    day: 24 * 60 * 60 * 1000,
    hour: 60 * 60 * 1000,
    minute: 60 * 1000,
    second: 1000,
  };
  const elapsed = d1.getTime() - d2.getTime();

  for (const u in units)
    if (Math.abs(elapsed) > units[u] || u === "second") {
      return rtf.format(
        Math.round(elapsed / units[u]),
        u as Intl.RelativeTimeFormatUnit
      );
    }

  return null;
}

export const firestoreTimestampSchema = z.custom<Timestamp>(data => {
  return data instanceof Timestamp;
});

export const camelCaseToTitleCase = (str: string) => {
  return str
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
    .replace(/([0-9]+)([a-zA-Z])/g, "$1 $2")
    .replace(/([a-zA-Z])([0-9]+)/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/\b\w/g, char => char.toUpperCase());
};
