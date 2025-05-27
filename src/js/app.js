import { TaskManager } from './taskManager.js';
import { Storage } from './storage.js';
import { UI } from './ui.js';
import { DragDrop } from './dragDrop.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize modules
  const storage = new Storage();
  const taskManager = new TaskManager(storage);
  const ui = new UI(taskManager);
  const dragDrop = new DragDrop(taskManager, ui);
  
  // Initialize the app
  ui.initialize();
  
  // Event listeners
  const addTaskForm = document.getElementById('add-task-form');
  const taskList = document.getElementById('task-list');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const clearCompletedBtn = document.getElementById('clear-completed');
  const themeToggleBtn = document.getElementById('theme-toggle');
  
  // Add task
  addTaskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    ui.handleAddTask();
  });
  
  // Task actions (using event delegation)
  taskList.addEventListener('click', (e) => {
    const taskItem = e.target.closest('.task-item');
    if (!taskItem) return;
    
    // Handle checkbox
    if (e.target.type === 'checkbox' || e.target.closest('.task-checkbox')) {
      const taskId = taskItem.dataset.id;
      ui.handleToggleTask(taskId);
    }
    
    // Handle delete
    if (e.target.closest('.delete-task-btn')) {
      const taskId = taskItem.dataset.id;
      ui.handleDeleteTask(taskId);
    }
  });
  
  // Filters
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      ui.applyFilter(filter);
      
      // Update active filter button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
    });
  });
  
  // Clear completed
  clearCompletedBtn.addEventListener('click', () => {
    ui.handleClearCompleted();
  });
  
  // Theme toggle
  themeToggleBtn.addEventListener('click', () => {
    ui.toggleTheme();
  });
  
  // Initialize drag and drop
  dragDrop.initialize();
});