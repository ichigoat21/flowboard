export function Button({
    children,
    onClick,
    size = "md",
    variant = "primary",
    className = "",
  }) {
    const base =
      "rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400/50";
  
    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    };
  
    const variants = {
      primary:
        "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700",
      plain:
        "bg-blue-100 text-blue-700 hover:bg-blue-200 active:bg-blue-300",
      outline:
        "border border-blue-400 text-blue-500 hover:bg-blue-50",
    };
  
    return (
      <button
        onClick={onClick}
        className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      >
        {children}
      </button>
    );
  }
  