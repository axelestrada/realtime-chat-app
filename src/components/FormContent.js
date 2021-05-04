export default function FormContent({ children, justifyContent = "justify-center", alignItems = "" }) {
  return (
    <div
      className={`w-full min-h-full flex flex-col max-w-sm py-6 px-9 m-auto ${justifyContent} ${alignItems}`}
    >
      {children}
    </div>
  );
}
