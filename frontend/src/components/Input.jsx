export function Input({
    placeholder = "",
    value,
    onChange,
    className = "",
    type = "text",
    reference 
  }) {
    return (
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        ref={reference}
        className={`
          w-full rounded-md border border-blue-200 bg-transparent
          px-3 py-2 text-sm text-blue-900
          placeholder-blue-400
          focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300/40
          transition-all duration-200
          hover:border-blue-300
          ${className}
        `}
      />
    );
  }
  