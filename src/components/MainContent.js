export default function MainContent({children}) {
  return (
    <div className="min-h-full overflow-y-auto bg-gray-50">
      {children}
    </div>
  );
}
