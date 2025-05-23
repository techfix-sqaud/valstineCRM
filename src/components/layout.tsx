
import { PropsWithChildren, ReactNode } from "react";
import { AppSidebar } from "./app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

interface LayoutProps extends PropsWithChildren {
  header?: ReactNode;
}

export default function Layout({ children, header }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
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
