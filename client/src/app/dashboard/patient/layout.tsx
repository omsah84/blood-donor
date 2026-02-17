import PatientNavbar from "./components/PatientNavbar";

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <PatientNavbar />

      <main className="flex-1 bg-gray-50 p-6">{children}</main>
    </div>
  );
}
