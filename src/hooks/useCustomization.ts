import { useState, useEffect } from 'react';
import { BusinessConfig, CustomField, ViewConfig, WorkflowConfig, NavigationItem, DashboardWidget } from '@/types/customization';

const defaultConfig: BusinessConfig = {
  customFields: {
    client: [
      {
        id: 'name',
        name: 'name',
        label: 'Name',
        type: 'text',
        required: true,
        order: 1,
        visible: true,
      },
      {
        id: 'company',
        name: 'company',
        label: 'Company',
        type: 'text',
        required: false,
        order: 2,
        visible: true,
      },
      {
        id: 'email',
        name: 'email',
        label: 'Email',
        type: 'email',
        required: true,
        order: 3,
        visible: true,
      },
      {
        id: 'phone',
        name: 'phone',
        label: 'Phone',
        type: 'phone',
        required: false,
        order: 4,
        visible: true,
      },
      {
        id: 'status',
        name: 'status',
        label: 'Status',
        type: 'select',
        required: true,
        options: ['active', 'inactive', 'lead'],
        order: 5,
        visible: true,
      },
    ],
  },
  views: [
    {
      id: 'default-clients',
      name: 'All Clients',
      entityType: 'client',
      columns: ['name', 'company', 'email', 'phone', 'status'],
      filters: [],
      isDefault: true,
    },
  ],
  workflows: [],
  navigation: [
    { id: 'dashboard', title: 'Dashboard', path: '/', icon: 'LayoutDashboard', order: 1, visible: true },
    { id: 'clients', title: 'Clients', path: '/clients', icon: 'Users', order: 2, visible: true },
    { id: 'invoices', title: 'Invoices', path: '/invoices', icon: 'FileText', order: 3, visible: true },
    { id: 'inventory', title: 'Inventory', path: '/inventory', icon: 'Package', order: 4, visible: true },
    { id: 'pos', title: 'Point of Sale', path: '/pos', icon: 'ShoppingCart', order: 5, visible: true },
    { id: 'reports', title: 'Reports', path: '/reports', icon: 'BarChart3', order: 6, visible: true },
    { id: 'settings', title: 'Settings', path: '/settings', icon: 'Settings', order: 7, visible: true },
    { id: 'billing', title: 'Billing', path: '/billing', icon: 'CreditCard', order: 8, visible: true },
  ],
  dashboardWidgets: [
    {
      id: 'total-clients',
      type: 'stat',
      title: 'Total Clients',
      size: 'small',
      position: { x: 0, y: 0 },
      visible: true,
      config: { value: '145', icon: 'Users', change: { value: '12%', positive: true } }
    },
    {
      id: 'pending-invoices',
      type: 'stat',
      title: 'Invoices Pending',
      size: 'small',
      position: { x: 1, y: 0 },
      visible: true,
      config: { value: '23', icon: 'FileText', change: { value: '5%', positive: false } }
    },
    {
      id: 'inventory-items',
      type: 'stat',
      title: 'Inventory Items',
      size: 'small',
      position: { x: 2, y: 0 },
      visible: true,
      config: { value: '738', icon: 'Package', change: { value: '8%', positive: true } }
    },
    {
      id: 'total-revenue',
      type: 'stat',
      title: 'Total Revenue',
      size: 'small',
      position: { x: 3, y: 0 },
      visible: true,
      config: { value: '$38,500', icon: 'Wallet', change: { value: '15%', positive: true } }
    },
    {
      id: 'sales-chart',
      type: 'chart',
      title: 'Sales Overview',
      size: 'large',
      position: { x: 0, y: 1 },
      visible: true,
      config: { chartType: 'line' }
    },
    {
      id: 'recent-activities',
      type: 'activity',
      title: 'Recent Activities',
      size: 'medium',
      position: { x: 2, y: 1 },
      visible: true,
      config: {}
    },
    {
      id: 'upcoming-tasks',
      type: 'tasks',
      title: 'Upcoming Tasks',
      size: 'large',
      position: { x: 0, y: 2 },
      visible: true,
      config: {}
    }
  ],
  customEntities: [], // Add this new property
  permissions: {
    admin: ['create', 'read', 'update', 'delete', 'customize'],
    user: ['create', 'read', 'update'],
    viewer: ['read'],
  },
  branding: {
    primaryColor: '#3b82f6',
    secondaryColor: '#64748b',
    companyName: 'My Business',
  },
  layout: {
    navbarPosition: 'sidebar',
  },
  security: {
    sessionTimeout: 30,
    autoLogout: true,
    maxLoginAttempts: 5,
  },
  features: {
    bulkActions: true,
    advancedSearch: true,
    analytics: true,
    taskManagement: true,
    clientHistory: true,
  },
};

export const useCustomization = () => {
  const [config, setConfig] = useState<BusinessConfig>(defaultConfig);

  useEffect(() => {
    // Load config from localStorage
    const savedConfig = localStorage.getItem('business-config');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        // Merge with default to ensure new properties are included
        setConfig({ ...defaultConfig, ...parsed });
      } catch (error) {
        console.error('Failed to parse saved config:', error);
      }
    }
  }, []);

  const saveConfig = (newConfig: BusinessConfig) => {
    setConfig(newConfig);
    localStorage.setItem('business-config', JSON.stringify(newConfig));
  };

  const addCustomField = (entityType: string, field: CustomField) => {
    const newConfig = { ...config };
    if (!newConfig.customFields[entityType]) {
      newConfig.customFields[entityType] = [];
    }
    newConfig.customFields[entityType].push(field);
    saveConfig(newConfig);
  };

  const updateCustomField = (entityType: string, fieldId: string, updates: Partial<CustomField>) => {
    const newConfig = { ...config };
    const fields = newConfig.customFields[entityType] || [];
    const fieldIndex = fields.findIndex(f => f.id === fieldId);
    if (fieldIndex >= 0) {
      fields[fieldIndex] = { ...fields[fieldIndex], ...updates };
      saveConfig(newConfig);
    }
  };

  const deleteCustomField = (entityType: string, fieldId: string) => {
    const newConfig = { ...config };
    if (newConfig.customFields[entityType]) {
      newConfig.customFields[entityType] = newConfig.customFields[entityType].filter(f => f.id !== fieldId);
      saveConfig(newConfig);
    }
  };

  const addView = (view: ViewConfig) => {
    const newConfig = { ...config };
    newConfig.views.push(view);
    
    // If view should be shown in navigation, add it
    if (view.showInNavigation) {
      const navItem: NavigationItem = {
        id: `view-${view.id}`,
        title: view.name,
        path: `/view/${view.id}`,
        icon: view.navigationIcon || 'Eye',
        order: view.navigationOrder || newConfig.navigation.length + 1,
        visible: true,
        isCustom: true,
        viewId: view.id
      };
      newConfig.navigation.push(navItem);
    }
    
    saveConfig(newConfig);
  };

  const updateView = (viewId: string, updates: Partial<ViewConfig>) => {
    const newConfig = { ...config };
    const viewIndex = newConfig.views.findIndex(v => v.id === viewId);
    if (viewIndex >= 0) {
      const oldView = newConfig.views[viewIndex];
      newConfig.views[viewIndex] = { ...oldView, ...updates };
      
      // Update corresponding navigation item
      const navIndex = newConfig.navigation.findIndex(n => n.viewId === viewId);
      if (updates.showInNavigation && navIndex === -1) {
        // Add to navigation
        const navItem: NavigationItem = {
          id: `view-${viewId}`,
          title: updates.name || oldView.name,
          path: `/view/${viewId}`,
          icon: updates.navigationIcon || oldView.navigationIcon || 'Eye',
          order: updates.navigationOrder || newConfig.navigation.length + 1,
          visible: true,
          isCustom: true,
          viewId: viewId
        };
        newConfig.navigation.push(navItem);
      } else if (!updates.showInNavigation && navIndex >= 0) {
        // Remove from navigation
        newConfig.navigation.splice(navIndex, 1);
      } else if (navIndex >= 0) {
        // Update navigation item
        newConfig.navigation[navIndex] = {
          ...newConfig.navigation[navIndex],
          title: updates.name || newConfig.navigation[navIndex].title,
          icon: updates.navigationIcon || newConfig.navigation[navIndex].icon,
          order: updates.navigationOrder || newConfig.navigation[navIndex].order
        };
      }
      
      saveConfig(newConfig);
    }
  };

  const deleteView = (viewId: string) => {
    const newConfig = { ...config };
    newConfig.views = newConfig.views.filter(v => v.id !== viewId);
    // Remove from navigation if exists
    newConfig.navigation = newConfig.navigation.filter(n => n.viewId !== viewId);
    saveConfig(newConfig);
  };

  const addWorkflow = (workflow: WorkflowConfig) => {
    const newConfig = { ...config };
    newConfig.workflows.push(workflow);
    saveConfig(newConfig);
  };

  const updateWorkflow = (workflowId: string, updates: Partial<WorkflowConfig>) => {
    const newConfig = { ...config };
    const workflowIndex = newConfig.workflows.findIndex(w => w.id === workflowId);
    if (workflowIndex >= 0) {
      newConfig.workflows[workflowIndex] = { ...newConfig.workflows[workflowIndex], ...updates };
      saveConfig(newConfig);
    }
  };

  const deleteWorkflow = (workflowId: string) => {
    const newConfig = { ...config };
    newConfig.workflows = newConfig.workflows.filter(w => w.id !== workflowId);
    saveConfig(newConfig);
  };

  // Navigation methods
  const updateNavigation = (items: NavigationItem[]) => {
    const newConfig = { ...config };
    newConfig.navigation = items;
    saveConfig(newConfig);
  };

  // Widget methods
  const addWidget = (widget: DashboardWidget) => {
    const newConfig = { ...config };
    newConfig.dashboardWidgets.push(widget);
    saveConfig(newConfig);
  };

  const updateWidget = (widgetId: string, updates: Partial<DashboardWidget>) => {
    const newConfig = { ...config };
    const widgetIndex = newConfig.dashboardWidgets.findIndex(w => w.id === widgetId);
    if (widgetIndex >= 0) {
      newConfig.dashboardWidgets[widgetIndex] = { ...newConfig.dashboardWidgets[widgetIndex], ...updates };
      saveConfig(newConfig);
    }
  };

  const deleteWidget = (widgetId: string) => {
    const newConfig = { ...config };
    newConfig.dashboardWidgets = newConfig.dashboardWidgets.filter(w => w.id !== widgetId);
    saveConfig(newConfig);
  };

  return {
    config,
    saveConfig,
    addCustomField,
    updateCustomField,
    deleteCustomField,
    addView,
    updateView,
    deleteView,
    addWorkflow,
    updateWorkflow,
    deleteWorkflow,
    updateNavigation,
    addWidget,
    updateWidget,
    deleteWidget,
  };
};
