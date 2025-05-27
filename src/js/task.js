/**
 * Task class representing a to-do item
 */
export class Task {
  /**
   * Constructor for Task
   * @param {string} id - Unique identifier
   * @param {string} content - Task description
   * @param {boolean} completed - Completion status
   * @param {string} createdAt - ISO date string of creation time
   */
  constructor(id, content, completed = false, createdAt = new Date().toISOString()) {
    this.id = id;
    this.content = content;
    this.completed = completed;
    this.createdAt = createdAt;
  }
  
  /**
   * Toggles the completed status of the task
   * @returns {Task} This task for chaining
   */
  toggle() {
    this.completed = !this.completed;
    return this;
  }
  
  /**
   * Creates a formatted task object
   * @returns {Object} Task data
   */
  toJSON() {
    return {
      id: this.id,
      content: this.content,
      completed: this.completed,
      createdAt: this.createdAt
    };
  }
  
  /**
   * Creates a Task instance from JSON data
   * @param {Object} data - Task data
   * @returns {Task} New Task instance
   */
  static fromJSON(data) {
    return new Task(
      data.id, 
      data.content, 
      data.completed, 
      data.createdAt
    );
  }
}