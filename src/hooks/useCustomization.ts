
import { useState, useEffect } from 'react';
import { BusinessConfig, CustomField, ViewConfig, WorkflowConfig } from '@/types/customization';

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
};

export const useCustomization = () => {
  const [config, setConfig] = useState<BusinessConfig>(defaultConfig);

  useEffect(() => {
    // Load config from localStorage
    const savedConfig = localStorage.getItem('business-config');
    if (savedConfig) {
      try {
        setConfig(JSON.parse(savedConfig));
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
    saveConfig(newConfig);
  };

  const updateView = (viewId: string, updates: Partial<ViewConfig>) => {
    const newConfig = { ...config };
    const viewIndex = newConfig.views.findIndex(v => v.id === viewId);
    if (viewIndex >= 0) {
      newConfig.views[viewIndex] = { ...newConfig.views[viewIndex], ...updates };
      saveConfig(newConfig);
    }
  };

  const deleteView = (viewId: string) => {
    const newConfig = { ...config };
    newConfig.views = newConfig.views.filter(v => v.id !== viewId);
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
  };
};
