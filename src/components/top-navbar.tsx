import {
  LogOut,
  Menu,
  Moon,
  Sun,
  Globe,
} from "lucide-react";
import * as icons from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { useCustomization } from "@/hooks/useCustomization";
import { useLanguage } from "@/hooks/useLanguage";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export function TopNavbar() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { config } = useCustomization();
  const { t, language, setLanguage, isRTL } = useLanguage();
  const isMobile = useIsMobile();
  const { toggleSidebar, setOpenMobile } = useSidebar();

  // Get visible navigation items sorted by order
  const visibleNavItems = config.navigation
    .filter(item => item.visible && !item.isHidden)
    .sort((a, b) => a.order - b.order);

  const getIcon = (iconName: string) => {
    const IconComponent = (icons as any)[iconName];
    return IconComponent || icons.Circle;
  };

  const getItemLabel = (item: any) => {
    if (item.entityType && config.customEntities) {
      const entity = config.customEntities.find(e => e.name === item.entityType);
      return entity ? entity.label : item.title;
    }
    return t(item.id) || item.title;
  };

  const MobileNavContent = () => (
    <div className="flex flex-col space-y-4 p-4">
      {visibleNavItems.map((item) => {
        const IconComponent = getIcon(item.icon);
        return (
          <Button
            key={item.id}
            variant="ghost"
            className={`justify-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <IconComponent className="h-5 w-5" />
            {getItemLabel(item)}
          </Button>
        );
      })}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Mobile hamburger menu for sidebar layout */}
          {config.layout.navbarPosition !== 'top' && isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setOpenMobile(true)}
              className="md:hidden"
            >
              <div className="flex flex-col justify-center items-center w-5 h-5 space-y-1">
                <div className="w-4 h-0.5 bg-current"></div>
                <div className="w-4 h-0.5 bg-current"></div>
                <div className="w-4 h-0.5 bg-current"></div>
              </div>
              <span className="sr-only">Open sidebar</span>
            </Button>
          )}
          
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="rounded-md bg-crm-blue p-1">
              <div className="h-6 w-6 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
            </div>
            <span className="text-lg font-bold">{config.branding.companyName}</span>
          </div>

          {/* Only show navigation menu for top nav layout */}
          {config.layout.navbarPosition === 'top' && (
            <>
              {isMobile ? (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side={isRTL ? "right" : "left"}>
                    <MobileNavContent />
                  </SheetContent>
                </Sheet>
              ) : (
                <nav className={`hidden md:flex items-center space-x-6 text-sm font-medium ${isRTL ? 'space-x-reverse' : ''}`}>
                  {visibleNavItems.map((item) => {
                    const IconComponent = getIcon(item.icon);
                    return (
                      <Button
                        key={item.id}
                        variant="ghost"
                        className={`gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
                        onClick={() => navigate(item.path)}
                      >
                        <IconComponent className="h-4 w-4" />
                        {getItemLabel(item)}
                      </Button>
                    );
                  })}
                </nav>
              )}
            </>
          )}
        </div>

        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setLanguage('en')}>
                English {language === 'en' && '✓'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('ar')}>
                العربية {language === 'ar' && '✓'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('es')}>
                Español {language === 'es' && '✓'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          <div 
            className={`flex items-center gap-2 cursor-pointer hover:bg-accent rounded-md p-2 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
            onClick={() => navigate('/profile')}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" alt="User" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="hidden sm:block">
              <p className="text-sm font-medium">{t('john-doe')}</p>
            </div>
          </div>

          <Button variant="ghost" size="icon">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
