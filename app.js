let todos = [];

let Todo = {
  id: 0,
  title: "",
  desc: "",
  isComplete: false,
};

// selectorler , global olarak kullanılacak html elemen selectorleri
const formModalEl = document.getElementById("todoFormModal");
const todoItemsEl = document.getElementById("todoItems");

// eğer modal açıksa kapatır kapalıysa modal'ı açar
const toggleModal = () => {
  formModalEl.classList.toggle("show");
};

// modal backdrop'a tıklanırsa modalı kapatmasını sağlar
formModalEl.addEventListener("click", (e) => {
  if (e.target.id == "todoFormModal") toggleModal();
});

// unique benzeri olmayan bir id üretir, her bir todo item için
const uniqueIdGenerator = () => {
  return Math.floor(Math.random() * 100000 + 1);
};

// -todos listesine yani ul tagına her bir todo li item'ını ekler
const insertTodoItemToList = (todoItem) => {
  const listItem = `<li class="todo-item ${
    todoItem.isComplete ? "complete" : ""
  }" data-id="${todoItem.id}">
  <div class="todo-item-check" data-id="${
    todoItem.id
  }" onclick="completeTask(this)">
    <img src="img/checked.svg" />
  </div>
  <div class="todo-item-details">
    <span class="todo-item-title">${todoItem.title}</span>
    <span class="todo-item-desc">${todoItem.desc}</span>
  </div>
  <img
    class="remove-todo"
    src="img/delete.png"
    width="32"
    height="32"
    onclick="removeTask(${todoItem.id})"
  />
</li>`;

  if (todoItemsEl.innerHTML && todos.length == 0) todoItemsEl.innerHTML = "";
  todoItemsEl.insertAdjacentHTML("beforeend", listItem);
};

// Localstorage'e todos array'ini kaydeder
const saveTodosToLS = () => {
  localStorage.setItem("todoItemsLS", JSON.stringify(todos));
};

// kaydet butonuna tıklanınca formdaki inputları okuyup todos arrayine ekler ve bunu htmlede ekler
const addTodo = () => {
  let todoItem;

  todoItem = {
    ...Todo,
    id: uniqueIdGenerator(),
    title: document.getElementsByName("title")[0].value,
    desc: document.getElementsByName("desc")[0].value,
  };

  insertTodoItemToList(todoItem);

  todos = [...todos, todoItem];
  saveTodosToLS();
  document.getElementById("todoForm").reset();
  toggleModal();
};

// checkbox div'ine tıklandığında taskı complete tasarımına dönüştürür
const completeTask = (e) => {
  e.parentNode.classList.toggle("complete");

  for (let i = 0; i < todos.length; i++) {
    if (todos[i].id == e.dataset.id) {
      todos[i].isComplete = !todos[i].isComplete;
      saveTodosToLS();
    }
  }
};

// delete ikonuna tıklanan elemanı htmlden ve todos arrayden siler bunu LS'e kaydeder
const removeTask = (id) => {
  const todoItemsEl = document.getElementsByClassName("todo-item");

  for (let i = 0; i < todoItemsEl.length; i++) {
    if (todoItemsEl[i].dataset.id == id) todoItemsEl[i].remove();
  }

  todos = todos.filter((item) => {
    if (item.id != id) return item;
  });
  saveTodosToLS();
};

// sayfa refresh edildiğinde listeyi ul'ye ekliyoruz
const listTodoItems = () => {
  todoItemsEl.innerHTML = "";
  todos.forEach((item) => {
    insertTodoItemToList(item);
  });
};

const todoItemsLS = localStorage.getItem("todoItemsLS");

// todoItemsLS değişkeni Localstorage'de var mı ? varsa bunları yap
if (todoItemsLS) {
  todos = JSON.parse(todoItemsLS);
  if (todos.length > 0) listTodoItems();
  else {
    const noneTodos = `<li class="none-todos">
    Henüz bir iş eklemediniz..
  </li>`;
    todoItemsEl.insertAdjacentHTML("beforeend", noneTodos);
  }
}
