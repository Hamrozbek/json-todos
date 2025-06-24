let elForm = document.querySelector("form");
let elList = document.querySelector(".list");

elForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const data = {
        name: e.target.todo.value
    };
    fetch("http://localhost:3000/todos", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-type": "application/json" }
    })
    .then(() => getTodos().then(renderTodos));
});

async function getTodos() {
    let res = await fetch("http://localhost:3000/todos");
    let data = await res.json();
    return data;
}

function renderTodos(todos) {
    elList.innerHTML = null;
    todos.map(item => {
        let elItem = document.createElement("li");
        elItem.innerHTML = `
        <div class="flex justify-between items-center p-[5px] ">
            <p class="border-[1px] w-[260px] rounded-[5px] p-[5px]">${item.name}</p>
            <div>
                <button data-id="${item.id}" class="edit-btn w-[80px] border-[1px] border-blue-600 text-center bg-blue-600 text-white py-[5px] rounded-[5px] cursor-pointer hover:bg-transparent hover:border-[1px] hover:border-white hover:text-white duration-300">Edit</button>
                <button data-id="${item.id}" class="delete-btn w-[80px] border-[1px] border-red-600 text-center bg-red-600 text-white py-[5px] rounded-[5px] cursor-pointer hover:bg-transparent hover:border-[1px] hover:border-white hover:text-white duration-300">Delete</button>
            </div>
        </div>
        `;
        elList.append(elItem);
    });
}

elList.addEventListener("click", function(e) {
    if (e.target.classList.contains("delete-btn")) {
        let id = e.target.dataset.id;
        DeleteBtn(id).then(() => getTodos().then(renderTodos));
    }

    if (e.target.classList.contains("edit-btn")) {
        let id = e.target.dataset.id;
        UpdateBtn(id).then(() => getTodos().then(renderTodos));
    }
});

function DeleteBtn(id) {
    return fetch(`http://localhost:3000/todos/${id}`, {
        method: "DELETE"
    });
}

function UpdateBtn(id) {
    let soz = prompt("Yangi so'z kiriting");
    if (soz === null || soz.trim() === "") {
        alert("Bo'sh qoldirish mumkun emas:");
        return Promise.resolve(); 
    }
    return fetch(`http://localhost:3000/todos/${id}`, {
        method: "PUT",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name: soz})
    });
}

getTodos().then(renderTodos);
