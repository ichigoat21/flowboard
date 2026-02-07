
const variantStyle = {
    "primary" : " bg-blue hover:bg-blue-700",
    "secondary" :  "bg-sky-600 hover:bg-sky-600",
    "red" : "bg-red-400 hover:bg-red-500",
    "blue" : "bg-blue-400 hover:bg-blue-500",
    "green" : "bg-green-400 hover:bg-green-500",
    "r-clicked" : "bg-red-500",
    "b-clicked" : "bg-blue-500",
    "g-clicked" : "bg-green-500"

}

const sizeStyle = {
    "sm" : "px-1",
    "md" : "px-4 py-2.5",
    "lg" : "w-full py-2"
}

export function Button({text, onclick,variant,size}){
    return <button onClick={onclick}
    className={`text-white ${variantStyle[variant]} box-border border border-transparent  focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-md text-sm ${sizeStyle[size]} focus:outline-none`}
    >{text}</button>
}