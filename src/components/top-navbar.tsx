
import { useState } from "react";
import { Menu, Moon, Sun, LogOut, Circle, User, Globe } from "lucide-react";
import * as icons from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "@/hooks/use-theme";
import { useCustomization } from "@/hooks/useCustomization";
import { useLanguage } from "@/hooks/useLanguage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
  const { t, language, setLanguage } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const visibleNavItems = config.navigation
    .filter(item => item.visible)
    .sort((a, b) => a.order - b.order);

  const mainNavItems = visibleNavItems.filter(item => 
    !['settings', 'billing'].includes(item.id)
  );

  const secondaryNavItems = visibleNavItems.filter(item => 
    ['settings', 'billing'].includes(item.id)
  );

  const getIcon = (iconName: string) => {
    const IconComponent = (icons as any)[iconName];
    return IconComponent || Circle;
  };

  return (
    <nav className="border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4">
        {/* Logo and Company Name */}
        <div className="flex items-center gap-2">
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

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {mainNavItems.map((item) => {
            const IconComponent = getIcon(item.icon);
            return (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => navigate(item.path)}
                className="flex items-center gap-2"
              >
                <IconComponent className="h-4 w-4" />
                <span>{t(item.id)}</span>
              </Button>
            );
          })}
        </div>

        {/* Right side - User menu and settings */}
        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <Globe className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setLanguage('en')}>
                English {language === 'en' && '✓'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('ar')}>
                العربية {language === 'ar' && '✓'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="hidden md:flex"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">{t('john-doe')}</p>
                  <p className="text-xs text-muted-foreground">{t('admin')}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                <span>{t('profile')}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {secondaryNavItems.map((item) => {
                const IconComponent = getIcon(item.icon);
                return (
                  <DropdownMenuItem
                    key={item.id}
                    onClick={() => navigate(item.path)}
                    className="flex items-center gap-2"
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{t(item.id)}</span>
                  </DropdownMenuItem>
                );
              })}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2 md:hidden">
                <Globe className="h-4 w-4" />
                <span>{t('language')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 md:hidden">
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
                <span onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                  {theme === "dark" ? t('light-mode') : t('dark-mode')}
                </span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                <span>{t('log-out')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile menu trigger */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col gap-4 mt-8">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">{t('main')}</h3>
                  {mainNavItems.map((item) => {
                    const IconComponent = getIcon(item.icon);
                    return (
                      <Button
                        key={item.id}
                        variant="ghost"
                        onClick={() => {
                          navigate(item.path);
                          setMobileMenuOpen(false);
                        }}
                        className="w-full justify-start gap-3"
                      >
                        <IconComponent className="h-4 w-4" />
                        <span>{t(item.id)}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
