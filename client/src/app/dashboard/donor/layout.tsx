import DonorNavbar from "./components/DonorNavbar";

export default function DonorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <DonorNavbar />

      <main className="flex-1 bg-gray-50 p-6">{children}</main>
    </div>
  );
}
