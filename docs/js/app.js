const btnSubmitTodo = document.querySelector('button[type=submit]')
const todoList = document.querySelector('.todo-list')
const input = document.querySelector('input[type=text]')
const btnToggleTheme = document.querySelector('button[class=toggle-theme]')
const imgParent = document.querySelector('aside')
const countTodo = document.querySelector('span[id="count-todo"]')
const modifyTodos = document.querySelector('.todo--description')

class App {

    constructor() {
        /* Private variables */
        this._allTodos = []
        this._themeObj = {
            light: {
                index: 0,
                name: "light",
                svg: '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26"><path fill="#FFF" fill-rule="evenodd" d="M13 0c.81 0 1.603.074 2.373.216C10.593 1.199 7 5.43 7 10.5 7 16.299 11.701 21 17.5 21c2.996 0 5.7-1.255 7.613-3.268C23.22 22.572 18.51 26 13 26 5.82 26 0 20.18 0 13S5.82 0 13 0z"/></svg>'
            },
            dark: {
                index: 1,
                name: "dark",
                svg: '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26"><path fill="#FFF" fill-rule="evenodd" d="M13 21a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-5.657-2.343a1 1 0 010 1.414l-2.121 2.121a1 1 0 01-1.414-1.414l2.12-2.121a1 1 0 011.415 0zm12.728 0l2.121 2.121a1 1 0 01-1.414 1.414l-2.121-2.12a1 1 0 011.414-1.415zM13 8a5 5 0 110 10 5 5 0 010-10zm12 4a1 1 0 110 2h-3a1 1 0 110-2h3zM4 12a1 1 0 110 2H1a1 1 0 110-2h3zm18.192-8.192a1 1 0 010 1.414l-2.12 2.121a1 1 0 01-1.415-1.414l2.121-2.121a1 1 0 011.414 0zm-16.97 0l2.121 2.12A1 1 0 015.93 7.344L3.808 5.222a1 1 0 011.414-1.414zM13 0a1 1 0 011 1v3a1 1 0 11-2 0V1a1 1 0 011-1z"/></svg>'
            }
        }
        this._theme = "light"

        /* Initialize the DOM */
        this._getLocalStorage()

        /* Events */
        btnToggleTheme.addEventListener('click', this._changeBackgroundImage.bind(this))
        btnSubmitTodo.addEventListener('click', this._addTodo.bind(this))
        todoList.addEventListener('click', this._todoContainer.bind(this))
        todoList.addEventListener('keypress', this._todoContainer.bind(this))
        modifyTodos.addEventListener('click', this._toolsForTodos.bind(this))
        modifyTodos.addEventListener('keypress', this._toolsForTodos.bind(this))
    }
    
    _changeBackgroundImage() {
        if(imgParent.children[0].classList.contains('hidden')) {
            this._theme = "light"
        } else {
            this._theme = "dark"
        }
        imgParent.children[this._themeObj[this._theme].index].classList.remove('hidden')
        imgParent.children[this._themeObj[this._theme].index ^ 1].classList.add('hidden')
        document.documentElement.setAttribute('data-theme', this._themeObj[this._theme].name)
        btnToggleTheme.innerHTML = this._themeObj[this._theme].svg
        localStorage.setItem('theme', this._themeObj[this._theme].name)
    }

    _addTodo(e) {
        e.preventDefault()
        if (input.value.trim() === '') return;
        Array.from(todoList.children).forEach(li => {
            if (li.children[1].textContent === input.value.trim()) { // If the input.value has the same value of an existant todo
                input.value = li.children[1].textContent + ' #' + Math.floor(Math.random() * 100).toString()
            }
        })
        let html = `
            <li data-state="active" ${modifyTodos.children[2].children[2].classList.contains('is-active') ? 'style="display: none;"' : ''} draggable="true">
                <button type="button" class="complete-button"></button>
                <span>${input.value.trim()}</span>
                <button type="button" class="delete-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path fill="var(--cross)" fill-rule="evenodd" d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"/></svg>
                </button>
            </li>
        `
        todoList.insertAdjacentHTML('beforeend', html)
        this._allTodos.push([input.value.trim(), 'active'])
        localStorage.setItem('allTodos', JSON.stringify(this._allTodos))
        countTodo.textContent = +countTodo.textContent + 1 // Add 1 to the items left
        input.value = ''
        input.focus()

    }

    
    _todoContainer(e) {
        const completeTodoBtn = e.target.closest('button[class="complete-button"]')
        const deleteTodoBtn = e.target.closest('button[class="delete-button"]')
        if(!completeTodoBtn && !deleteTodoBtn) return;
        if(completeTodoBtn) {
            completeTodoBtn.parentElement.classList.add('is-done')
            completeTodoBtn.classList.add('is-completed')
            /* Find the index of the completed todo on the array _allTodos
               (is the array we are setting in the localStorage) */
            const index = this._allTodos.findIndex(str => {
                return str[0] === completeTodoBtn.nextElementSibling.textContent
            })
            this._allTodos[index][1] = 'completed' // Add completed
            completeTodoBtn.parentElement.dataset.state = "completed"
            completeTodoBtn.insertAdjacentHTML('afterbegin', '<svg xmlns="http://www.w3.org/2000/svg" width="11" height="9"><path fill="none" stroke="#FFF" stroke-width="2" d="M1 4.304L3.696 7l6-6"/></svg>')
        }
        if(deleteTodoBtn) {
            deleteTodoBtn.parentElement.remove()
            const index = this._allTodos.findIndex(str => {
               return str[0] === deleteTodoBtn.parentElement.children[1].textContent
            })
            this._allTodos.splice(index, 1) // Remove the the todo from the array
            countTodo.textContent = +countTodo.textContent - 1
        }
        localStorage.setItem('allTodos', JSON.stringify(this._allTodos)) // Update the localStorage
    }

    _toolsForTodos(e) {
        const anchor = e.target.closest('a')
        if(!anchor) return;
        if(anchor.parentElement.tagName === "NAV" && !anchor.classList.contains('is-active')) { // If the anchor is one of the nav element
            Array.from(anchor.parentElement.children).forEach(a => {
                a.classList.remove('is-active')
            })
            anchor.classList.add('is-active')

            /* Update the DOM according to the active anchor */
            Array.from(todoList.children).forEach(li => {
                li.style.display = ''
                if (li.dataset.state !== anchor.dataset.state && anchor.dataset.state !== undefined) {
                    li.style.display = "none"
                }
            })
        }
        if(anchor.textContent.trim() === "Clear Completed") {
            Array.from(todoList.children).forEach(li => {
                if (li.classList.contains('is-done')) {
                    const index = this._allTodos.findIndex(str => {
                        return str[0] === li.children[1].textContent
                    })
                    this._allTodos.splice(index, 1)
                    li.remove()
                    countTodo.textContent = +countTodo.textContent - 1
                }
            })
        }
        localStorage.setItem('allTodos', JSON.stringify(this._allTodos))
    }

    _getLocalStorage() {
        this._theme = localStorage.getItem('theme')
        if(!this._theme) return;
        imgParent.children[this._themeObj[this._theme].index].classList.remove('hidden')
        imgParent.children[this._themeObj[this._theme].index ^ 1].classList.add('hidden')
        document.documentElement.setAttribute('data-theme', this._themeObj[this._theme].name)
        btnToggleTheme.innerHTML = this._themeObj[this._theme].svg
        if (!JSON.parse(localStorage.getItem('allTodos'))) return;
        this._allTodos = JSON.parse(localStorage.getItem('allTodos'))
        this._allTodos.forEach(todo => {
            let html = `
                <li data-state="${todo[1]}"  ${todo[1] === "completed" ? 'class="is-done"' : ''} draggable="true">
                    <button type="button" class="complete-button${todo[1] === "completed" ? ' is-completed' : ''}">
                        ${todo[1] === "completed" ? '<svg xmlns="http://www.w3.org/2000/svg" width="11" height="9"><path fill="none" stroke="#FFF" stroke-width="2" d="M1 4.304L3.696 7l6-6"/></svg>' : ''}
                    </button>
                    <span>${todo[0]}</span>
                    <button type="button" class="delete-button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path fill="var(--cross)" fill-rule="evenodd" d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"/></svg>
                    </button>
                </li>
            `
            todoList.insertAdjacentHTML('beforeend', html)
            countTodo.textContent = +countTodo.textContent + 1
        })
    }
}

const app = new App()