import { Global, Lock, People } from "iconsax-reactjs";

export const PRIVACY_OPTIONS = [
  { value: "public", label: "Public", hint: "Anyone can see this", icon: Global },
  { value: "following", label: "Followers", hint: "Only your followers", icon: People },
  { value: "only_me", label: "Only me", hint: "Only you can see this", icon: Lock },
] as const;

export function getPrivacyOption(value: string) {
  return PRIVACY_OPTIONS.find((o) => o.value === value) ?? PRIVACY_OPTIONS[0];
}