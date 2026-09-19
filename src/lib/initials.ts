// "Jake Rivera" -> "JR". Shared by the hero's trust row and the testimonial cards,
// so both always show the same letters for the same person.
export const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
