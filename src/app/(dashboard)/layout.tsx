import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-[280px] min-h-screen">
        <div className="container py-6 px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
