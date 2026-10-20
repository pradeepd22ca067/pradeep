const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todosList = document.querySelector("#todos-list");
const taskCount = document.querySelector("#task-count");
const emptyState = document.querySelector("#empty-state");
const clearCompletedButton = document.querySelector("#clear-completed");
const progressBar = document.querySelector(".progress-track");
const progressFill = document.querySelector("#progress-fill");
const progressLabel = document.querySelector("#progress-label");
const filterButtons = document.querySelectorAll(".filter-button");
const storageKey = "daylist-tasks";

let currentFilter = "all";
let todos = loadTodos();

function loadTodos() {
    try {
        const savedTodos = JSON.parse(localStorage.getItem(storageKey) || "[]");
        if (!Array.isArray(savedTodos)) {
            throw new TypeError("Saved tasks must be a list.");
        }

        return savedTodos.filter((todo) =>
            todo &&
            typeof todo.id === "string" &&
            typeof todo.text === "string" &&
            typeof todo.completed === "boolean"
        );
    } catch (error) {
        console.error("Unable to load saved tasks.", error);
        return [];
    }
}

function saveTodos() {
    try {
        localStorage.setItem(storageKey, JSON.stringify(todos));
    } catch (error) {
        console.error("Unable to save tasks to this browser.", error);
    }
}

function renderTodos() {
    const visibleTodos = todos.filter((todo) => {
        if (currentFilter === "active") return !todo.completed;
        if (currentFilter === "completed") return todo.completed;
        return true;
    });
    const completedCount = todos.filter((todo) => todo.completed).length;
    const remainingCount = todos.length - completedCount;
    const completionPercent = todos.length === 0 ? 0 : Math.round((completedCount / todos.length) * 100);

    todosList.replaceChildren();
    visibleTodos.forEach((todo) => {
        const listItem = document.createElement("li");
        listItem.className = `todo-item${todo.completed ? " is-complete" : ""}`;
        listItem.dataset.id = todo.id;

        const toggleButton = document.createElement("button");
        toggleButton.className = "todo-toggle";
        toggleButton.type = "button";
        toggleButton.setAttribute("aria-label", `${todo.completed ? "Mark as to do" : "Mark as done"}: ${todo.text}`);
        toggleButton.setAttribute("aria-pressed", String(todo.completed));
        toggleButton.textContent = todo.completed ? "✓" : "";

        const text = document.createElement("p");
        text.className = "todo";
        text.textContent = todo.text;

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-task";
        deleteButton.type = "button";
        deleteButton.setAttribute("aria-label", `Delete task: ${todo.text}`);
        deleteButton.textContent = "×";

        listItem.append(toggleButton, text, deleteButton);
        todosList.append(listItem);
    });

    taskCount.textContent = `${remainingCount} ${remainingCount === 1 ? "task" : "tasks"} left`;
    clearCompletedButton.hidden = completedCount === 0;
    progressFill.style.width = `${completionPercent}%`;
    progressBar.setAttribute("aria-valuenow", String(completionPercent));
    progressLabel.textContent = `${completionPercent}% complete`;

    const hasVisibleTodos = visibleTodos.length > 0;
    emptyState.hidden = hasVisibleTodos;
    if (todos.length === 0) {
        emptyState.querySelector("strong").textContent = "Nothing on your list yet";
        emptyState.querySelector("span:last-child").textContent = "Add a task above and take it one step at a time.";
    } else if (!hasVisibleTodos) {
        emptyState.querySelector("strong").textContent = "No tasks in this view";
        emptyState.querySelector("span:last-child").textContent = "Try another filter to find what you’re looking for.";
    }
}

todoForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = todoInput.value.trim();
    if (!text) {
        todoInput.focus();
        return;
    }

    const id = typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    todos.unshift({ id, text, completed: false });
    currentFilter = "all";
    updateFilterButtons();
    saveTodos();
    renderTodos();
    todoForm.reset();
    todoInput.focus();
});

todosList.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    const listItem = button?.closest(".todo-item");
    if (!button || !listItem) return;

    const todo = todos.find((item) => item.id === listItem.dataset.id);
    if (!todo) return;

    if (button.classList.contains("todo-toggle")) {
        todo.completed = !todo.completed;
    } else if (button.classList.contains("delete-task")) {
        todos = todos.filter((item) => item.id !== todo.id);
    } else {
        return;
    }

    saveTodos();
    renderTodos();
});

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        currentFilter = button.dataset.filter;
        updateFilterButtons();
        renderTodos();
    });
});

function updateFilterButtons() {
    filterButtons.forEach((button) => {
        const isActive = button.dataset.filter === currentFilter;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });
}

clearCompletedButton.addEventListener("click", () => {
    todos = todos.filter((todo) => !todo.completed);
    saveTodos();
    renderTodos();
});

renderTodos();
