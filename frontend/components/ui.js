import clsx from "clsx";

/* Button */
export function Button({ children, variant = "primary", className, ...props }) {
  const base =
    "inline-flex items-center justify-center px-5 py-2.5 rounded-xl-2 font-medium transition-all duration-200 active:scale-95";

  const variants = {
    primary:
      "bg-green-500 text-white hover:bg-green-600 shadow-soft",
    primarySoft:
      "bg-green-200 text-gray-700 hover:bg-green-300 shadow-soft",
    secondary:
      "bg-pink-400 text-white hover:bg-pink-500 shadow-soft",
    secondarySoft:
      "bg-pink-200 text-gray-700 hover:bg-pink-300 shadow-soft",
    ghost:
      "bg-gray-200 text-gray-700 hover:bg-gray-300 shadow-soft",
    success:
      "bg-pastelGreen text-softGreen border border-softGreen hover:bg-green-100",

    warning:
      "bg-pastelYellow text-softYellow border border-softYellow hover:bg-yellow-100",

    danger: "bg-pastelRed text-softRed border border-softRed hover:bg-red-100",

    outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
  };

  return (
    <button className={clsx(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}

/* Card */
export function Card({ children, className }) {
  return (
    <div
      className={clsx(
        "bg-white rounded-xl-2 shadow-soft p-6 transition-all duration-200 hover:-translate-y-1",
        className
      )}
    >
      {children}
    </div>
  );
}

/* Icon Wrapper */
export function IconBox({ children, color = "green" }) {
  const colors = {
    green: "bg-green-100 text-green-600",
    pink: "bg-pink-100 text-pink-600",
    purple: "bg-purple-100 text-purple-600",
  };

  return (
    <div
      className={clsx(
        "w-14 h-14 rounded-full flex items-center justify-center",
        colors[color]
      )}
    >
      {children}
    </div>
  );
}