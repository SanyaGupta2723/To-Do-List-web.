import { Task } from './task.js';

export class TaskManager {
  constructor(storage) {
    this.storage = storage;
    this.tasks = this.storage.getTasks();
    this.currentFilter = 'all';
  }
  
  /**
   * Adds a new task
   * @param {string} content - The task content
   * @returns {Task} The newly created task
   */
  addTask(content) {
    const newTask = new Task(
      Date.now().toString(),
      content,
      false,
      new Date().toISOString()
    );
    
    this.tasks.push(newTask);
    this.saveTasks();
    
    return newTask;
  }
  
  /**
   * Toggles the completed status of a task
   * @param {string} id - The task ID
   * @returns {Task|null} The updated task or null if not found
   */
  toggleTask(id) {
    const task = this.getTaskById(id);
    if (task) {
      task.completed = !task.completed;
      this.saveTasks();
      return task;
    }
    return null;
  }
  
  /**
   * Deletes a task by ID
   * @param {string} id - The task ID
   * @returns {boolean} Whether the deletion was successful
   */
  deleteTask(id) {
    const initialLength = this.tasks.length;
    this.tasks = this.tasks.filter(task => task.id !== id);
    
    if (this.tasks.length < initialLength) {
      this.saveTasks();
      return true;
    }
    return false;
  }
  
  /**
   * Clears all completed tasks
   * @returns {number} The number of tasks cleared
   */
  clearCompleted() {
    const initialLength = this.tasks.length;
    this.tasks = this.tasks.filter(task => !task.completed);
    
    this.saveTasks();
    return initialLength - this.tasks.length;
  }
  
  /**
   * Returns filtered tasks based on current filter
   * @returns {Array<Task>} Filtered tasks
   */
  getFilteredTasks() {
    switch(this.currentFilter) {
      case 'active':
        return this.tasks.filter(task => !task.completed);
      case 'completed':
        return this.tasks.filter(task => task.completed);
      case 'all':
      default:
        return [...this.tasks];
    }
  }
  
  /**
   * Gets a task by ID
   * @param {string} id - The task ID
   * @returns {Task|undefined} The found task or undefined
   */
  getTaskById(id) {
    return this.tasks.find(task => task.id === id);
  }
  
  /**
   * Reorders tasks based on drag and drop
   * @param {string} sourceId - The ID of the task being moved
   * @param {string} targetId - The ID of the task to insert before/after
   */
  reorderTasks(sourceId, targetId) {
    // Find indexes
    const sourceIndex = this.tasks.findIndex(task => task.id === sourceId);
    const targetIndex = this.tasks.findIndex(task => task.id === targetId);
    
    if (sourceIndex === -1 || targetIndex === -1) return;
    
    // Remove the source task
    const [movedTask] = this.tasks.splice(sourceIndex, 1);
    
    // Insert at the target position
    this.tasks.splice(targetIndex, 0, movedTask);
    this.saveTasks();
  }
  
  /**
   * Saves tasks to storage
   */
  saveTasks() {
    this.storage.saveTasks(this.tasks);
  }
  
  /**
   * Gets the active task count
   * @returns {number} Number of active tasks
   */
  getActiveCount() {
    return this.tasks.filter(task => !task.completed).length;
  }
  
  /**
   * Sets the current filter
   * @param {string} filter - The filter to apply ('all', 'active', 'completed')
   */
  setFilter(filter) {
    this.currentFilter = filter;
  }
}