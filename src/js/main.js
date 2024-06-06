document.addEventListener('DOMContentLoaded', () => {
	const todoInput = document.getElementById('todo-add-input');
	const todoAddButton = document.getElementById('todo-add-button');
	const todoList = document.getElementById('todo-list');
	const noTasksMessage = document.getElementById('no-tasks-message');
	const tasksLeftMessage = document.getElementById('tasks-left-message');
	const completedTasksCount = document.getElementById('completed-tasks-count');
	const allTasksCount = document.getElementById('all-tasks-count');
	const successMessage = document.getElementById('success-message');
	const modalWarning = document.getElementById('modal-warning');
	const clearCompletedButton = document.getElementById('clear-completed-button');
	const clearAll = document.getElementById('clear-all-button');
	
	// Generate a random ID for each task
	function generateRandomId() {
		const randomNumbers = Math.floor(1000 + Math.random() * 9000);
		return `checkbox-${randomNumbers}`;
	}
	
	// Save tasks to localStorage
	function saveTasks() {
		const tasks = [];
		todoList.querySelectorAll('li').forEach((task) => {
			tasks.push({
				id: task.getAttribute('data-id'),
				text: task.querySelector('.content label').textContent.trim(),
				completed: task.classList.contains('completed'),
			});
		});
		localStorage.setItem('tasks', JSON.stringify(tasks));
		updateTasksInfo();
	}
	
	// Render the todo list from localStorage
	function renderTodoList() {
		const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
		todoList.innerHTML = '';
		tasks.forEach((task) => {
			const taskElement = createTaskElement(task.text, task.completed, task.id);
			todoList.appendChild(taskElement);
		});
		updateTasksInfo();
	}
	
	// Create a task element
	function createTaskElement(taskText, completed = false, id = generateRandomId()) {
		const li = document.createElement('li');
		li.setAttribute('data-id', id);
	
		const taskContent = document.createElement('div');
		taskContent.classList.add('content');
	
		const checkbox = document.createElement('input');
		checkbox.type = 'checkbox';
		checkbox.checked = completed;
	
		const label = document.createElement('label');
	
		const customCheckbox = document.createElement('span');
		customCheckbox.classList.add('checkbox');
	
		const customLabel = document.createElement('span');
		customLabel.classList.add('label');
		customLabel.textContent = taskText;

		const amends = document.createElement('div');
		amends.classList.add('amends');
	
		const deleteButton = document.createElement('span');
		deleteButton.classList.add('remove');
		deleteButton.textContent = 'Remove.';
	
		const editButton = document.createElement('span');
		editButton.classList.add('edit');
		editButton.textContent = 'Edit.';
	
		taskContent.appendChild(checkbox);
		taskContent.appendChild(label);
		label.appendChild(customCheckbox);
		label.appendChild(customLabel);
		li.appendChild(taskContent);
		li.appendChild(amends);
		amends.appendChild(editButton);
		amends.appendChild(deleteButton);
	
		if (completed) {
			li.classList.add('completed');
		}
	
		handleDeleteTask(li);
		handleCompleteTask(li);
		handleEditTask(li, customLabel, editButton);
	
		return li;
	}
	
	// Create delete button functionality
	function handleDeleteTask(taskElement) {
		taskElement.querySelector('.remove').addEventListener('click', () => {
			todoList.removeChild(taskElement);
			saveTasks();
		});
	}
	
	// Handle task completion functionality
	function handleCompleteTask(taskElement) {
		const checkbox = taskElement.querySelector('input[type="checkbox"]');
		const isCompleted = taskElement.classList.contains('completed');
	
		checkbox.checked = isCompleted;
	
		taskElement.querySelector('label .checkbox').addEventListener('click', () => {
			taskElement.classList.toggle('completed');
			checkbox.checked = taskElement.classList.contains('completed');
			saveTasks();
		});
	}

	// Handle task edition functionality
	function handleEditTask(taskElement, label, editButton) {
		let enterKeyPressed = false;
	
		editButton.addEventListener('click', () => {
			const allTasks = todoList.querySelectorAll('li');
			allTasks.forEach((task) => {
				if (task !== taskElement) {
					task.classList.add('disabled');
				} else {
					task.classList.add('active');
				}
			});
	
			editButton.classList.add('disabled');
	
			label.setAttribute('contenteditable', 'true');
			const range = document.createRange();
			const selection = window.getSelection();
			range.setStart(label, label.childNodes.length);
			range.collapse(true);
			selection.removeAllRanges();
			selection.addRange(range);
			label.focus();
		});
	
		label.addEventListener('keypress', (event) => {
			const isEnterKey = event.key === 'Enter';
			if (isEnterKey) {
				enterKeyPressed = true;
				event.preventDefault();
				finishEditing(label);
			}
		});
	
		label.addEventListener('blur', () => {
			if (!enterKeyPressed) {
				finishEditing(label);
			}
			enterKeyPressed = false;
		});
	
		function finishEditing(label) {
			if (label.hasAttribute('contenteditable')) {
				if (label.textContent.trim() !== '') {
					label.removeAttribute('contenteditable');
					saveTasks();
				} else {
					if (taskElement.parentNode === todoList) {
						todoList.removeChild(taskElement);
					}
					saveTasks();
				}
				
				const allTasks = todoList.querySelectorAll('li');
				allTasks.forEach((task) => {
					task.classList.remove('disabled');
					task.classList.remove('active');
				});
	
				editButton.classList.remove('disabled');
			}
		}
	}
	
	// Update task-related information
	function updateTasksInfo() {
		const allTasks = todoList.querySelectorAll('li').length;
		const tasksLeft = todoList.querySelectorAll('li:not(.completed)').length;
		const completedTasks = todoList.querySelectorAll('li.completed').length;
	
		completedTasksCount.textContent = completedTasks;
		allTasksCount.textContent = allTasks;
	
		if (tasksLeft === 0 && todoList.children.length > 0) {
			noTasksMessage.style.display = 'none';
			successMessage.style.display = 'block';
			tasksLeftMessage.style.display = 'none';
			clearCompletedButton.style.display = 'flex';
			clearAll.style.display = 'flex';
		} else if (tasksLeft === 0 && todoList.children.length === 0) {
			tasksLeftMessage.style.display = 'none';
			successMessage.style.display = 'none';
			clearCompletedButton.style.display = 'none';
			clearAll.style.display = 'none';
			noTasksMessage.style.display = 'flex';
		} else {
			noTasksMessage.style.display = 'none';
			successMessage.style.display = 'none';
			tasksLeftMessage.style.display = 'block';
			clearCompletedButton.style.display = 'flex';
			clearAll.style.display = 'flex';
		}
	
		if (completedTasks > 0) {
			clearCompletedButton.parentElement.classList.remove('hidden');
		} else {
			clearCompletedButton.parentElement.classList.add('hidden');
		}
	}
	
	// Clear completed tasks from the list
	function clearCompletedTasks() {
		todoList.querySelectorAll('li.completed').forEach((task) => {
			todoList.removeChild(task);
		});
		saveTasks();
	}
	
	// Clear all tasks from the list
	function clearAllTasks() {
		todoList.querySelectorAll('li').forEach((task) => {
			todoList.removeChild(task);
		});
		saveTasks();
	}
	
	// Add a new task to the list
	function addTask() {
		const taskText = todoInput.value.trim();
		if (taskText !== '') {
			const taskElement = createTaskElement(taskText);
			todoList.appendChild(taskElement);
			todoInput.value = '';
			saveTasks();
		} else {
			Toast();
		}
	}
	
	// Show a warning toast message
	function Toast() {
		modalWarning.classList.add('show');
		setTimeout(() => {
			modalWarning.classList.remove('show');
		}, 3000);
	}
	
	// Event listener for the add button
	todoAddButton.addEventListener('click', (e) => {
		e.preventDefault();
		addTask();
	});
	
	// Event listener for the 'Enter' key in the input field
	todoInput.addEventListener('keypress', (e) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			addTask();
		}
	});
	
	// Add event listener for clearing completed tasks
	clearCompletedButton.addEventListener('click', clearCompletedTasks);
	
	// Add event listener for clearing all tasks
	clearAll.addEventListener('click', clearAllTasks);
	
	// Initial rendering of the todo list
	renderTodoList();
});
