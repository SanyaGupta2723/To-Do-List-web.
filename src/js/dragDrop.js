export class DragDrop {
  constructor(taskManager, ui) {
    this.taskManager = taskManager;
    this.ui = ui;
    this.draggedItem = null;
  }
  
  /**
   * Initializes drag and drop functionality
   */
  initialize() {
    this.setupEventListeners();
  }
  
  /**
   * Sets up event listeners for drag and drop
   */
  setupEventListeners() {
    const taskList = document.getElementById('task-list');
    
    // Delegate events to the task list
    taskList.addEventListener('dragstart', this.handleDragStart.bind(this));
    taskList.addEventListener('dragover', this.handleDragOver.bind(this));
    taskList.addEventListener('dragleave', this.handleDragLeave.bind(this));
    taskList.addEventListener('drop', this.handleDrop.bind(this));
    taskList.addEventListener('dragend', this.handleDragEnd.bind(this));
  }
  
  /**
   * Handles the dragstart event
   * @param {DragEvent} e - The drag event
   */
  handleDragStart(e) {
    const taskItem = e.target.closest('.task-item');
    if (!taskItem) return;
    
    this.draggedItem = taskItem;
    
    // Set data for drag operation
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', taskItem.dataset.id);
    
    // Add dragging class after a small delay to avoid visual glitch
    setTimeout(() => {
      taskItem.classList.add('dragging');
    }, 0);
  }
  
  /**
   * Handles the dragover event
   * @param {DragEvent} e - The drag event
   */
  handleDragOver(e) {
    e.preventDefault();
    
    const taskItem = e.target.closest('.task-item');
    if (!taskItem || taskItem === this.draggedItem) return;
    
    // Get mouse position relative to the task item
    const rect = taskItem.getBoundingClientRect();
    const y = e.clientY - rect.top;
    
    // If mouse is in the top half, insert before. If in bottom half, insert after
    if (y < rect.height / 2) {
      taskItem.style.borderTop = '2px solid var(--color-primary)';
      taskItem.style.borderBottom = '';
    } else {
      taskItem.style.borderBottom = '2px solid var(--color-primary)';
      taskItem.style.borderTop = '';
    }
  }
  
  /**
   * Handles the dragleave event
   * @param {DragEvent} e - The drag event
   */
  handleDragLeave(e) {
    const taskItem = e.target.closest('.task-item');
    if (!taskItem) return;
    
    taskItem.style.borderTop = '';
    taskItem.style.borderBottom = '';
  }
  
  /**
   * Handles the drop event
   * @param {DragEvent} e - The drag event
   */
  handleDrop(e) {
    e.preventDefault();
    
    const taskItem = e.target.closest('.task-item');
    if (!taskItem || taskItem === this.draggedItem) return;
    
    // Clear visual cues
    taskItem.style.borderTop = '';
    taskItem.style.borderBottom = '';
    
    // Get IDs
    const draggedId = this.draggedItem.dataset.id;
    const targetId = taskItem.dataset.id;
    
    // Determine position based on mouse position
    const rect = taskItem.getBoundingClientRect();
    const y = e.clientY - rect.top;
    
    // Reorder tasks
    const taskList = document.getElementById('task-list');
    if (y < rect.height / 2) {
      taskList.insertBefore(this.draggedItem, taskItem);
    } else {
      taskList.insertBefore(this.draggedItem, taskItem.nextSibling);
    }
    
    // Update task order in task manager
    this.taskManager.reorderTasks(draggedId, targetId);
  }
  
  /**
   * Handles the dragend event
   */
  handleDragEnd() {
    if (this.draggedItem) {
      this.draggedItem.classList.remove('dragging');
      this.draggedItem = null;
      
      // Reset all borders
      const taskItems = document.querySelectorAll('.task-item');
      taskItems.forEach(item => {
        item.style.borderTop = '';
        item.style.borderBottom = '';
      });
    }
  }
}