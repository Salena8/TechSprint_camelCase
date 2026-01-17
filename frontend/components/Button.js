export default function Button({ children, ...props }) {
    return (
      <button
        className="px-4 py-2 rounded-xl bg-pastelGreen hover:opacity-90"
        {...props}
      >
        {children}
      </button>
    );
  }
  