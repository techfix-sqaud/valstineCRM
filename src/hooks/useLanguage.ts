
import { useState, useEffect, createContext, useContext } from 'react';

export type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations = {
  en: {
    dashboard: 'Dashboard',
    clients: 'Clients',
    invoices: 'Invoices',
    inventory: 'Inventory',
    reports: 'Reports',
    settings: 'Settings',
    billing: 'Billing',
    profile: 'Profile',
    customization: 'System Customization',
    'light-mode': 'Light Mode',
    'dark-mode': 'Dark Mode',
    'total-clients': 'Total Clients',
    'pending-invoices': 'Invoices Pending',
    'inventory-items': 'Inventory Items',
    'total-revenue': 'Total Revenue',
    'sales-overview': 'Sales Overview',
    'recent-activities': 'Recent Activities',
    'upcoming-tasks': 'Upcoming Tasks',
    'run-automation': 'Run Automation',
    'welcome-back': 'Welcome back, here\'s an overview of your business',
    'task-completed': 'Task completed',
    'automation-running': 'Automation running',
    'client-followup-emails': 'Client follow-up emails are being sent',
    'no-widgets-configured': 'No widgets configured. Go to System Customization to add widgets.',
    'log-out': 'Log out',
    'admin': 'Admin',
    'john-doe': 'John Doe',
    'main': 'Main',
    'account': 'Account',
    'language': 'Language',
    'layout': 'Layout',
    'sidebar-navigation': 'Sidebar Navigation',
    'top-navigation': 'Top Navigation',
    'navigation-position': 'Navigation Position'
  },
  ar: {
    dashboard: 'لوحة التحكم',
    clients: 'العملاء',
    invoices: 'الفواتير',
    inventory: 'المخزون',
    reports: 'التقارير',
    settings: 'الإعدادات',
    billing: 'الفوترة',
    profile: 'الملف الشخصي',
    customization: 'تخصيص النظام',
    'light-mode': 'الوضع الفاتح',
    'dark-mode': 'الوضع الداكن',
    'total-clients': 'إجمالي العملاء',
    'pending-invoices': 'الفواتير المعلقة',
    'inventory-items': 'عناصر المخزون',
    'total-revenue': 'إجمالي الإيرادات',
    'sales-overview': 'نظرة عامة على المبيعات',
    'recent-activities': 'الأنشطة الحديثة',
    'upcoming-tasks': 'المهام القادمة',
    'run-automation': 'تشغيل الأتمتة',
    'welcome-back': 'مرحباً بعودتك، إليك نظرة عامة على عملك',
    'task-completed': 'تم إنجاز المهمة',
    'automation-running': 'تشغيل الأتمتة',
    'client-followup-emails': 'يتم إرسال رسائل متابعة العملاء',
    'no-widgets-configured': 'لم يتم تكوين أي ودجات. اذهب إلى تخصيص النظام لإضافة ودجات.',
    'log-out': 'تسجيل الخروج',
    'admin': 'مدير',
    'john-doe': 'جون دو',
    'main': 'الرئيسي',
    'account': 'الحساب',
    'language': 'اللغة',
    'layout': 'التخطيط',
    'sidebar-navigation': 'شريط التنقل الجانبي',
    'top-navigation': 'شريط التنقل العلوي',
    'navigation-position': 'موضع التنقل'
  }
};

export const LanguageContext = createContext<LanguageContextType | null>(null);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const useLanguageProvider = () => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('app-language') as Language;
    if (savedLanguage && ['en', 'ar'].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app-language', lang);
    
    // Update document direction and language
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  const isRTL = language === 'ar';

  return {
    language,
    setLanguage,
    t,
    isRTL
  };
};
