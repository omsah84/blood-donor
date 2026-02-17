import OrganizationNavbar from "./components/OrganizationNavbar";

export default function OrganizationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <OrganizationNavbar />

      <main className="flex-1 bg-gray-50 p-6">{children}</main>
    </div>
  );
}
