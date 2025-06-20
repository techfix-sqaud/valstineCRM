
export type FieldType = 'text' | 'email' | 'phone' | 'number' | 'date' | 'select' | 'multiselect' | 'boolean' | 'textarea';

export interface CustomField {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  options?: string[];
  defaultValue?: any;
  order: number;
  visible: boolean;
}

export interface ViewConfig {
  id: string;
  name: string;
  entityType: 'client' | 'invoice' | 'inventory' | 'user';
  columns: string[];
  filters: FilterConfig[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  isDefault: boolean;
}

export interface FilterConfig {
  field: string;
  operator: 'equals' | 'contains' | 'starts_with' | 'greater_than' | 'less_than' | 'between';
  value: any;
}

export interface WorkflowConfig {
  id: string;
  name: string;
  entityType: 'client' | 'invoice' | 'inventory';
  trigger: 'create' | 'update' | 'delete' | 'status_change';
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
  active: boolean;
}

export interface WorkflowCondition {
  field: string;
  operator: string;
  value: any;
}

export interface WorkflowAction {
  type: 'send_email' | 'update_field' | 'create_task' | 'send_notification';
  config: any;
}

export interface BusinessConfig {
  customFields: Record<string, CustomField[]>;
  views: ViewConfig[];
  workflows: WorkflowConfig[];
  permissions: Record<string, string[]>;
  branding: {
    primaryColor: string;
    secondaryColor: string;
    logo?: string;
    companyName: string;
  };
}
