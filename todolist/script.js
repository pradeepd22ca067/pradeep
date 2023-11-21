let TodoInput = document.querySelector(".todo-input");
let AddTodoInput = document.querySelector(".add-todo");
let todosList = document.querySelector(".todos-list");


function addTodo() {
    let todo = TodoInput.value;
    let listItem = document.createElement("li");
    listItem.classList.add("todo-item");

    let pTag = document.createElement("p");
    pTag.classList.add("todo");
    pTag.innerHTML = todo;

    let deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-task");
    deleteButton.innerHTML = "DELETE";

    deleteButton.addEventListener("click", function(event) {
        event.target.parentNode.remove();
    })

    listItem.append(pTag);
    listItem.append(deleteButton);
    todosList.append(listItem);
    TodoInput.value = "";
}
AddTodoInput.addEventListener("click", function() {
    todo = TodoInput.value;
    if (todo) {
        addTodo();
    } else {
        alert("you haven't entered any todo!!!")
    }
})
TodoInput.addEventListener("keypress", function(event) {
    if (event.key == "Enter") {
        addTodo();
    }
})