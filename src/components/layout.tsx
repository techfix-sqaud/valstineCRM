import { PropsWithChildren, ReactNode } from "react";
import { Menu } from "lucide-react";
import { AppSidebar } from "./app-sidebar";
import { TopNavbar } from "./top-navbar";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useCustomization } from "@/hooks/useCustomization";
import { useLanguage } from "@/hooks/useLanguage";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps extends PropsWithChildren {
  header?: ReactNode;
}

// Mobile Header Component for Sidebar Layout
function MobileHeader({ header }: { header?: ReactNode }) {
  const { toggleSidebar } = useSidebar();
  const { config } = useCustomization();
  const { isRTL } = useLanguage();
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b bg-background p-4 md:hidden">
      <div
        className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
      >
        {/* Hamburger Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-9 w-9"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </div>

      {/* Additional header content if provided */}
      {header && <div className="flex-1 px-4">{header}</div>}
    </header>
  );
}

// Sidebar Layout Content Component
function SidebarLayoutContent({
  children,
  header,
}: {
  children: ReactNode;
  header?: ReactNode;
}) {
  const { isRTL } = useLanguage();
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <div
        className={`min-h-screen flex w-full bg-background ${
          isRTL ? "rtl" : "ltr"
        }`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <AppSidebar />
        <div className="flex flex-1 flex-col min-w-0">
          {/* Mobile Header with Hamburger */}
          <MobileHeader header={header} />

          {/* Desktop Header */}
          {header && !isMobile && (
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

export default function Layout({ children, header }: LayoutProps) {
  const { config } = useCustomization();
  const { isRTL } = useLanguage();
  const isTopNav = config.layout.navbarPosition === "top";

  if (isTopNav) {
    return (
      <div
        className={`min-h-screen bg-background ${isRTL ? "rtl" : "ltr"}`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <TopNavbar />
        <div className="flex flex-col">
          {header && (
            <header className="border-b bg-background p-4">{header}</header>
          )}
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    );
  }

  return (
    <SidebarLayoutContent header={header}>{children}</SidebarLayoutContent>
  );
}
