export class Storage {
  /**
   * Constructor initializes the storage key
   */
  constructor() {
    this.STORAGE_KEY = 'taskflow-tasks';
  }
  
  /**
   * Gets tasks from localStorage
   * @returns {Array} Tasks from storage or empty array
   */
  getTasks() {
    try {
      const tasksJSON = localStorage.getItem(this.STORAGE_KEY);
      return tasksJSON ? JSON.parse(tasksJSON) : [];
    } catch (error) {
      console.error('Error getting tasks from storage:', error);
      return [];
    }
  }
  
  /**
   * Saves tasks to localStorage
   * @param {Array} tasks - Tasks to save
   * @returns {boolean} Whether the save was successful
   */
  saveTasks(tasks) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
      return true;
    } catch (error) {
      console.error('Error saving tasks to storage:', error);
      return false;
    }
  }
  
  /**
   * Clears all tasks from storage
   * @returns {boolean} Whether the clear was successful
   */
  clearTasks() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing tasks from storage:', error);
      return false;
    }
  }
  
  /**
   * Gets the theme preference from storage
   * @returns {string} 'dark' or 'light'
   */
  getThemePreference() {
    return localStorage.getItem('taskflow-theme') || 'light';
  }
  
  /**
   * Saves the theme preference to storage
   * @param {string} theme - 'dark' or 'light'
   */
  saveThemePreference(theme) {
    localStorage.setItem('taskflow-theme', theme);
  }
}