
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
  showInNavigation?: boolean;
  navigationIcon?: string;
  navigationOrder?: number;
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

export interface NavigationItem {
  id: string;
  title: string;
  path: string;
  icon: string;
  order: number;
  visible: boolean;
  isCustom?: boolean;
  viewId?: string;
}

export interface DashboardWidget {
  id: string;
  type: 'stat' | 'chart' | 'activity' | 'tasks' | 'custom';
  title: string;
  size: 'small' | 'medium' | 'large';
  position: { x: number; y: number };
  visible: boolean;
  config: any;
}

export interface BusinessConfig {
  customFields: Record<string, CustomField[]>;
  views: ViewConfig[];
  workflows: WorkflowConfig[];
  navigation: NavigationItem[];
  dashboardWidgets: DashboardWidget[];
  permissions: Record<string, string[]>;
  branding: {
    primaryColor: string;
    secondaryColor: string;
    logo?: string;
    companyName: string;
  };
  layout: {
    navbarPosition: 'sidebar' | 'top';
  };
}
