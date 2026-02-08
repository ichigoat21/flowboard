export function InputComponent({ placeholder,  type, value, onchange }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onchange}
      className={
        type === "text"
          ? `
            w-full
            h-[2.5em]
            pl-[0.8em]
            rounded-[10px]
            border-2 border-transparent
            bg-[#F3F3F3]
            outline-none
            overflow-hidden
            transition-all duration-500

            hover:border-[#4A9DEC]
            hover:shadow-[0_0_0_7px_rgba(74,157,236,0.2)]
            hover:bg-white

            focus:border-[#4A9DEC]
            focus:shadow-[0_0_0_7px_rgba(74,157,236,0.2)]
            focus:bg-white
          `
          : ""
      }
    />
  )
}
