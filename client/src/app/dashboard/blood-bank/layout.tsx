import BloodBankNavbar from "./components/BloodBankNavbar";

export default function BloodBankLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <BloodBankNavbar />

      <main className="flex-1 bg-gray-50 p-6">{children}</main>
    </div>
  );
}
