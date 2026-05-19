// components/LoadingSpinner.tsx
export function LoadingSpinner({ size = "sm" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  };

  return (
    <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-ink/20 border-t-ink`} />
  );
}
