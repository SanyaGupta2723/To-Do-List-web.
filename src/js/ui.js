export class UI {
  constructor(taskManager) {
    this.taskManager = taskManager;
    this.taskList = document.getElementById('task-list');
    this.newTaskInput = document.getElementById('new-task-input');
    this.taskCountElement = document.getElementById('task-count');
    this.emptyStateElement = document.getElementById('empty-state');
  }
  
  /**
   * Initializes the UI
   */
  initialize() {
    this.renderTasks();
    this.updateTaskCount();
    this.loadThemePreference();
  }
  
  /**
   * Renders all tasks based on current filter
   */
  renderTasks() {
    this.taskList.innerHTML = '';
    const filteredTasks = this.taskManager.getFilteredTasks();
    
    // Show/hide empty state
    if (filteredTasks.length === 0) {
      this.emptyStateElement.classList.add('visible');
    } else {
      this.emptyStateElement.classList.remove('visible');
    }
    
    // Render each task
    filteredTasks.forEach(task => {
      this.renderTask(task);
    });
  }
  
  /**
   * Renders a single task
   * @param {Task} task - The task to render
   */
  renderTask(task) {
    const li = document.createElement('li');
    li.className = 'task-item';
    if (task.completed) {
      li.classList.add('completed');
    }
    li.dataset.id = task.id;
    li.draggable = true;
    
    li.innerHTML = `
      <label class="task-checkbox">
        <input type="checkbox" ${task.completed ? 'checked' : ''}>
        <span class="checkmark"></span>
      </label>
      <span class="task-content">${this.escapeHTML(task.content)}</span>
      <div class="task-actions">
        <button class="delete-task-btn" aria-label="Delete task"></button>
      </div>
    `;
    
    this.taskList.appendChild(li);
  }
  
  /**
   * Handles adding a new task
   */
  handleAddTask() {
    const content = this.newTaskInput.value.trim();
    if (!content) return;
    
    const task = this.taskManager.addTask(content);
    this.renderTask(task);
    this.updateTaskCount();
    
    // Clear input
    this.newTaskInput.value = '';
    this.newTaskInput.focus();
    
    // If was showing empty state, hide it
    this.emptyStateElement.classList.remove('visible');
    
    // Add a small animation to the new task
    const taskElement = this.taskList.lastElementChild;
    this.animateTaskAddition(taskElement);
  }
  
  /**
   * Handles toggling a task's completion status
   * @param {string} taskId - The ID of the task to toggle
   */
  handleToggleTask(taskId) {
    const task = this.taskManager.toggleTask(taskId);
    if (task) {
      const taskElement = this.getTaskElement(taskId);
      if (taskElement) {
        if (task.completed) {
          taskElement.classList.add('completed');
        } else {
          taskElement.classList.remove('completed');
        }
        
        // If the current filter would hide this task, re-render after a delay
        if ((this.taskManager.currentFilter === 'active' && task.completed) ||
            (this.taskManager.currentFilter === 'completed' && !task.completed)) {
          setTimeout(() => this.renderTasks(), 300);
        }
        
        this.updateTaskCount();
      }
    }
  }
  
  /**
   * Handles deleting a task
   * @param {string} taskId - The ID of the task to delete
   */
  handleDeleteTask(taskId) {
    const taskElement = this.getTaskElement(taskId);
    if (!taskElement) return;
    
    // Animate removal
    this.animateTaskRemoval(taskElement, () => {
      // After animation, actually delete the task
      const deleted = this.taskManager.deleteTask(taskId);
      if (deleted) {
        this.updateTaskCount();
        
        // Check if we need to show empty state
        if (this.taskManager.getFilteredTasks().length === 0) {
          this.emptyStateElement.classList.add('visible');
        }
      }
    });
  }
  
  /**
   * Handles clearing all completed tasks
   */
  handleClearCompleted() {
    const completedItems = document.querySelectorAll('.task-item.completed');
    if (completedItems.length === 0) return;
    
    // Confirm before clearing
    if (confirm(`Clear ${completedItems.length} completed tasks?`)) {
      // Animate all completed items
      const animationPromises = Array.from(completedItems).map(item => {
        return new Promise(resolve => {
          this.animateTaskRemoval(item, resolve);
        });
      });
      
      // After all animations complete, clear the tasks
      Promise.all(animationPromises).then(() => {
        this.taskManager.clearCompleted();
        this.renderTasks();
        this.updateTaskCount();
      });
    }
  }
  
  /**
   * Applies a filter to the task list
   * @param {string} filter - The filter to apply ('all', 'active', 'completed')
   */
  applyFilter(filter) {
    this.taskManager.setFilter(filter);
    this.renderTasks();
  }
  
  /**
   * Updates the task count display
   */
  updateTaskCount() {
    const activeCount = this.taskManager.getActiveCount();
    this.taskCountElement.textContent = `${activeCount} task${activeCount !== 1 ? 's' : ''} left`;
  }
  
  /**
   * Gets a task element by ID
   * @param {string} taskId - The task ID
   * @returns {HTMLElement|null} The task element or null
   */
  getTaskElement(taskId) {
    return document.querySelector(`.task-item[data-id="${taskId}"]`);
  }
  
  /**
   * Animates a task being added
   * @param {HTMLElement} element - The task element
   */
  animateTaskAddition(element) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
      element.style.transition = 'opacity 300ms, transform 300ms';
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, 10);
  }
  
  /**
   * Animates a task being removed
   * @param {HTMLElement} element - The task element
   * @param {Function} callback - Called after animation completes
   */
  animateTaskRemoval(element, callback) {
    element.style.transition = 'opacity 300ms, transform 300ms';
    element.style.opacity = '0';
    element.style.transform = 'translateX(30px)';
    
    setTimeout(() => {
      element.remove();
      if (callback) callback();
    }, 300);
  }
  
  /**
   * Toggles between light and dark themes
   */
  toggleTheme() {
    const body = document.body;
    const isDark = body.classList.toggle('dark-theme');
    
    // Save preference
    const storage = this.taskManager.storage;
    storage.saveThemePreference(isDark ? 'dark' : 'light');
  }
  
  /**
   * Loads theme preference from storage
   */
  loadThemePreference() {
    const storage = this.taskManager.storage;
    const theme = storage.getThemePreference();
    
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    }
  }
  
  /**
   * Escapes HTML to prevent XSS
   * @param {string} html - The string to escape
   * @returns {string} Escaped string
   */
  escapeHTML(html) {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
  }
}