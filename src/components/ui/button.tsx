import type { ButtonHTMLAttributes } from "react";

type ButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link"
  | "filter"
  | "filterActive";

type ButtonSize = "default" | "sm" | "lg" | "icon";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const variants: Record<ButtonVariant, string> = {
  default: "bg-forest text-white hover:bg-forest/90",
  destructive: "bg-tomato text-white hover:bg-tomato/90",
  outline: "border border-border-soft bg-transparent hover:bg-canvas",
  secondary: "bg-canvas text-ink hover:bg-canvas/80",
  ghost: "hover:bg-canvas hover:text-ink",
  link: "text-forest underline-offset-4 hover:underline",
  filter: "border-border-mid text-muted hover:border-forest hover:text-forest",
  filterActive: "border-forest bg-forest text-white",
};

const sizes: Record<ButtonSize, string> = {
  default: "h-10 px-4 py-2",
  sm: "h-9 px-3",
  lg: "h-11 px-8",
  icon: "size-10",
};

export function Button({
  className = "",
  variant = "default",
  size = "default",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-transparent text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:pointer-events-none disabled:opacity-50 ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    />
  );
}