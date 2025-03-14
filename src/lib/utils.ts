import { clsx, type ClassValue } from "clsx";
import { FirebaseError } from "firebase/app";
import { twMerge } from "tailwind-merge";

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
      case "validation_failed":
        return "Neispravni podaci.";
      case "invalid_credentials":
        return "Račun s tim podacima ne postoji.";
      case "weak_password":
        return "Lozinka mora biti barem 6 znakova duga.";
      case "user_already_exists":
        return "Račun s tim emailom već postoji.";
      default:
        return error.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Nepoznata greška.";
}
