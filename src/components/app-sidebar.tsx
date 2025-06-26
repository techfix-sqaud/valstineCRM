import {
  LogOut,
  Menu,
  Moon,
  Sun,
  Circle,
  Globe,
  EyeOff,
  Eye,
} from "lucide-react";
import * as icons from "lucide-react";
import { useState, useRef } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { useCustomization } from "@/hooks/useCustomization";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AppSidebar() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { config, updateNavigation } = useCustomization();
  const { t, language, setLanguage, isRTL } = useLanguage();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { setOpenMobile } = useSidebar();
  const [longPressTimers, setLongPressTimers] = useState<Record<string, NodeJS.Timeout>>({});

  // Get visible navigation items sorted by order
  const visibleNavItems = config.navigation
    .filter(item => item.visible && !item.isHidden)
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

  const getItemLabel = (item: any) => {
    // If it's a custom entity, get the label from the entity configuration
    if (item.entityType && config.customEntities) {
      const entity = config.customEntities.find(e => e.name === item.entityType);
      return entity ? entity.label : item.title;
    }
    // For regular items, use translation
    return t(item.id) || item.title;
  };

  const handleLongPressStart = (itemId: string) => {
    const timer = setTimeout(() => {
      const updatedNavigation = config.navigation.map(item =>
        item.id === itemId ? { ...item, isHidden: true } : item
      );
      updateNavigation(updatedNavigation);
      toast({
        title: t('item-hidden') || 'Item Hidden',
        description: t('item-hidden-message') || 'Navigation item has been hidden. You can restore it in Settings > Customization.',
        action: (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              const restoredNavigation = config.navigation.map(item =>
                item.id === itemId ? { ...item, isHidden: false } : item
              );
              updateNavigation(restoredNavigation);
            }}
          >
            <Eye className="h-4 w-4 mr-1" />
            {t('restore') || 'Restore'}
          </Button>
        ),
      });
    }, 1000); // 1 second long press

    setLongPressTimers(prev => ({ ...prev, [itemId]: timer }));
  };

  const handleLongPressEnd = (itemId: string) => {
    if (longPressTimers[itemId]) {
      clearTimeout(longPressTimers[itemId]);
      setLongPressTimers(prev => {
        const newTimers = { ...prev };
        delete newTimers[itemId];
        return newTimers;
      });
    }
  };

  const handleNavItemClick = (path: string) => {
    navigate(path);
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const renderNavItem = (item: any) => {
    const IconComponent = getIcon(item.icon);
    return (
      <SidebarMenuItem key={item.id}>
        <SidebarMenuButton
          onClick={() => handleNavItemClick(item.path)}
          onMouseDown={() => handleLongPressStart(item.id)}
          onMouseUp={() => handleLongPressEnd(item.id)}
          onMouseLeave={() => handleLongPressEnd(item.id)}
          onTouchStart={() => handleLongPressStart(item.id)}
          onTouchEnd={() => handleLongPressEnd(item.id)}
          className="flex items-center gap-3 w-full select-none"
        >
          <IconComponent className="h-5 w-5 shrink-0" />
          <span className="truncate">{getItemLabel(item)}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar side={isRTL ? "right" : "left"}>
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center justify-between">
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
            <span className="text-lg font-bold truncate">{config.branding.companyName}</span>
          </div>
          <SidebarTrigger className="md:hidden">
            <Menu className="h-5 w-5" />
          </SidebarTrigger>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('main')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map(renderNavItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{t('account')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNavItems.map(renderNavItem)}
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton className="flex items-center gap-3 w-full">
                      <Globe className="h-5 w-5 shrink-0" />
                      <span className="truncate">{t('language')}</span>
                    </SidebarMenuButton>
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
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="flex items-center gap-3 w-full"
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5 shrink-0" />
                  ) : (
                    <Moon className="h-5 w-5 shrink-0" />
                  )}
                  <span className="truncate">{theme === "dark" ? t('light-mode') : t('dark-mode')}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center justify-between p-4">
          <div 
            className={`flex items-center gap-3 min-w-0 flex-1 cursor-pointer hover:bg-accent rounded-md p-2 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
            onClick={() => {
              navigate('/profile');
              if (isMobile) setOpenMobile(false);
            }}
          >
            <Avatar className="shrink-0">
              <AvatarImage src="/placeholder.svg" alt="User" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{t('john-doe')}</p>
              <p className="text-xs text-muted-foreground truncate">{t('admin')}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="shrink-0">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
