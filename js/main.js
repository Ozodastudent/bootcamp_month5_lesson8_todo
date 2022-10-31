const formEl = document.querySelector(".form");
const inputEl = document.querySelector(".input_todo");
const btnEl = document.querySelector(".btn_todo");
const listEl = document.querySelector(".list_todo");
const buttonCard = document.querySelector(".button_card");
const allBtnText = document.querySelector(".all_btn_text");
const completedBtnText = document.querySelector(".completed_btn_text");
const unCompletedBtnText = document.querySelector(".uncompleted_btn_text");

let initialId = 0;
const renderTodo = function (array, item) {
  item.innerHTML = "";
  allBtnText.textContent = array.length;
  completedBtnText.textContent = todos.filter(
    (element) => element.isCompleted == true
  ).length;
  unCompletedBtnText.textContent = todos.filter(
    (element) => !element.isCompleted
  ).length;

  array.forEach(function (obj) {
    const newListItem = document.createElement("li");
    newListItem.classList.add("list_item");

    const taskBox = document.createElement("div");
    taskBox.classList.add("task_box_item");

    const taskCheckBox = document.createElement("input");
    taskCheckBox.dataset.id = obj.id;
    taskCheckBox.type = "checkbox";
    taskCheckBox.classList.add("checkbox_item");
    taskBox.appendChild(taskCheckBox);

    const taskText = document.createElement("p");
    taskText.textContent = obj.title;
    taskText.classList.add("task_text");
    taskBox.appendChild(taskText);
    newListItem.appendChild(taskBox);

    if (obj.isCompleted) {
      taskCheckBox.checked = true;
      taskText.style.textDecoration = "line-through";
    }
    const buttonsGroup = document.createElement("div");
    buttonsGroup.classList.add("button_group");
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete_btn", "btn", "btn-danger");
    deleteBtn.type = "button";
    deleteBtn.textContent = "delete";
    deleteBtn.dataset.id = obj.id;
    buttonsGroup.appendChild(deleteBtn);

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit_btn", "btn", "btn-info");
    editBtn.type = "button";
    editBtn.textContent = "edit";
    editBtn.dataset.id = obj.id;
    buttonsGroup.appendChild(editBtn);
    newListItem.appendChild(buttonsGroup);

    listEl.appendChild(newListItem);
  });
};

const formTypes = {
  SAVE: "save",
  EDIT: "edit",
};
let formType = formTypes.SAVE;
let editingId = null;

const localTodos = JSON.parse(window.localStorage.getItem("todos"));
const todos = localTodos || [];
renderTodo(todos, listEl);

formEl.addEventListener("submit", function (evt) {
  evt.preventDefault();
  if (formType === formTypes.SAVE) {
    todos.push({
      id: ++initialId,
      title: inputEl.value,
      isCompleted: false,
    });
    renderTodo(todos, listEl);
    window.localStorage.setItem("todos", JSON.stringify(todos));
    formEl.reset();
  }
  if (formType === formTypes.EDIT) {
    const obj = {
      id: editingId,
      title: inputEl.value,
      isCompleted: false,
    };
    const editingFoundIndex = todos.findIndex(function (todo) {
      return todo.id === obj.id;
    });
    todos.splice(editingFoundIndex, 1, obj);
    window.localStorage.setItem("todos", JSON.stringify(todos));
    renderTodo(todos, listEl);
    formType = formTypes.SAVE;
    btnEl.textContent = "Add";
    formEl.reset();
  }
});

listEl.addEventListener("click", function (evt) {
  // deleting part

  if (evt.target.matches(".delete_btn")) {
    const deletedBtnId = Number(evt.target.dataset.id);
    listEl.innerHTML = "";
    const deletedFindIndex = todos.findIndex(
      (todo) => todo.id === deletedBtnId
    );
    todos.splice(deletedFindIndex, 1);
    window.localStorage.setItem("todos", JSON.stringify(todos));
    console.log(todos);
    renderTodo(todos, listEl);
  }

  //   editing part

  if (evt.target.matches(".edit_btn")) {
    const editedBtnId = Number(evt.target.dataset.id);
    const editedTodoFound = todos.find(function (todo) {
      return todo.id === editedBtnId;
    });
    inputEl.value = editedTodoFound.title;
    btnEl.textContent = "edit";
    editingId = editedBtnId;
    formType = formTypes.EDIT;
  }

  if (evt.target.matches(".checkbox_item")) {
    const checkBoxId = Number(evt.target.dataset.id);
    const checkBoxFound = todos.find(function (todo) {
      return todo.id === checkBoxId;
    });
    checkBoxFound.isCompleted = !checkBoxFound.isCompleted;
    window.localStorage.setItem("todos", JSON.stringify(todos));
    console.log(checkBoxFound);
    renderTodo(todos, listEl);
  }
});

buttonCard.addEventListener("click", function (evt) {
  if (evt.target.matches(".all_btn")) {
    renderTodo(todos, listEl);
  }
  if (evt.target.matches(".completed_btn")) {
    const completedTodos = todos.filter((todo) => todo.isCompleted);
    renderTodo(completedTodos, listEl);
  }
  if (evt.target.matches(".uncompleted_btn")) {
    const uncompletedTodos = todos.filter((todo) => !todo.isCompleted);
    renderTodo(uncompletedTodos, listEl);
  }
  if (evt.target.matches(".clear_btn")) {
  }
});
