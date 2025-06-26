/**
 * Utility functions for client status styling
 */

export type ClientStatus = 'active' | 'inactive' | 'lead';

/**
 * Get the CSS classes for a client status badge
 */
export function getClientStatusBadgeClasses(status: ClientStatus | string): string {
  switch (status) {
    case 'active':
      return 'border-green-500 bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400';
    case 'inactive':
      return 'border-red-500 bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400';
    case 'lead':
      return 'border-orange-500 bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-400';
    default:
      return 'border-gray-500 bg-gray-50 text-gray-600 dark:bg-gray-950 dark:text-gray-400';
  }
}

/**
 * Get the color class for client status icons/text
 */
export function getClientStatusColor(status: ClientStatus | string): string {
  switch (status) {
    case 'active':
      return 'text-green-600';
    case 'inactive':
      return 'text-red-600';
    case 'lead':
      return 'text-orange-600';
    default:
      return 'text-gray-600';
  }
}

/**
 * Get the background color class for client status
 */
export function getClientStatusBgColor(status: ClientStatus | string): string {
  switch (status) {
    case 'active':
      return 'bg-green-100 dark:bg-green-950';
    case 'inactive':
      return 'bg-red-100 dark:bg-red-950';  
    case 'lead':
      return 'bg-orange-100 dark:bg-orange-950';
    default:
      return 'bg-gray-100 dark:bg-gray-950';
  }
}
