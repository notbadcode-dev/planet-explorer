/**
 * Constants for LocalStorageAdapter.ts
 * Error messages and validation strings
 */

export const ERROR_MESSAGES = {
    STORAGE_UNAVAILABLE: 'localStorage unavailable',
    GET_FAILED: 'Failed to get item from localStorage',
    SET_FAILED: 'Failed to set item in localStorage',
    REMOVE_FAILED: 'Failed to remove item from localStorage',
    CLEAR_FAILED: 'Failed to clear localStorage',
    CANNOT_GET: 'cannot get',
    CANNOT_SET: 'cannot set',
    CANNOT_REMOVE: 'cannot remove',
    CANNOT_CLEAR: 'cannot clear',
} as const;

export const TEST_KEY = '__planet_explorer_storage_test__';

export const TYPE_UNDEFINED = 'undefined' as const;

export const MESSAGE_SEPARATOR = ', ';
export const KEY_SEPARATOR = ' ';
export const DETAIL_SEPARATOR = ': ';
