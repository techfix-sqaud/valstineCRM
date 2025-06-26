
import { PropsWithChildren, ReactNode } from "react";
import { AppSidebar } from "./app-sidebar";
import { TopNavbar } from "./top-navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useCustomization } from "@/hooks/useCustomization";
import { useLanguage } from "@/hooks/useLanguage";

interface LayoutProps extends PropsWithChildren {
  header?: ReactNode;
}

export default function Layout({ children, header }: LayoutProps) {
  const { config } = useCustomization();
  const { isRTL } = useLanguage();
  const isTopNav = config.layout.navbarPosition === 'top';

  if (isTopNav) {
    return (
      <div className="min-h-screen bg-background">
        <TopNavbar />
        <div className="flex flex-col">
          {header && (
            <header className="border-b bg-background p-4">
              {header}
            </header>
          )}
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className={`min-h-screen flex w-full bg-background ${isRTL ? 'flex-row-reverse' : ''}`}>
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          {header && (
            <header className="sticky top-0 z-10 border-b bg-background p-4">
              {header}
            </header>
          )}
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
