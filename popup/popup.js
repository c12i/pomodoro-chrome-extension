// dom element creator
function elt(type, props, ...children) {
    const dom = document.createElement(type)
    if (props) {
        Object.assign(dom, props)
    }
    for (let child of children) {
        if (typeof child !== 'string') {
            dom.appendChild(child)
        } else {
            dom.appendChild(document.createTextNode(child))
        }
    }
    return dom
}

let tasks = []

function updateTime() {
    chrome.storage.local.get(
        ['timer', 'timeOption'],
        ({ timer, timeOption }) => {
            const time = document.getElementById('timer')
            const minutes = `${timeOption - Math.ceil(timer / 60)}`.padStart(
                2,
                '0'
            )
            let seconds = '00'
            if (timer % 60 !== 0) {
                seconds = `${60 - (timer % 60)}`.padStart(2, '0')
            }
            time.textContent = `${minutes}:${seconds}`
        }
    )
}

updateTime()
setInterval(updateTime, 1000)

const startTimer = document.getElementById('start-timer')
startTimer.addEventListener('click', () => {
    chrome.storage.local.get(['isRunning'], ({ isRunning }) => {
        chrome.storage.local.set(
            {
                isRunning: !isRunning,
            },
            () => {
                startTimer.textContent = !isRunning
                    ? 'Pause Timer'
                    : 'Resume Timer'
            }
        )
    })
})

const resetTimer = document.getElementById('reset-timer')
resetTimer.addEventListener('click', () => {
    chrome.storage.local.set({ timer: 0 })
})

chrome.storage.sync.get(['tasks'], (result) => {
    tasks = result.tasks ? result.tasks : []
    renderTasks()
})

function saveTasks() {
    chrome.storage.sync.set({ tasks }, () => {
        startTimer.textContent = 'Start Timer'
    })
}

function renderTasks() {
    const taskContainer = document.getElementById('task-container')
    taskContainer.textContent = ''
    tasks.forEach((_, taskNum) => renderTask(taskNum))
}

function renderTask(taskNum) {
    const taskContainer = document.getElementById('task-container')
    const wrapperElement = elt(
        'div',
        { id: taskNum, class: 'task-item' },
        elt('input', {
            type: 'text',
            placeholder: 'enter a task',
            value: tasks[taskNum],
            className: 'task-input',
            onchange: (e) => {
                tasks[taskNum] = e.target.value
                saveTasks()
            },
        }),
        elt('input', {
            type: 'button',
            className: 'task-delete',
            value: 'x',
            onclick: () => {
                tasks.splice(taskNum, 1)
                wrapperElement.remove()
                saveTasks()
                renderTasks()
            },
        })
    )
    taskContainer.appendChild(wrapperElement)
}

const addTaskBtn = document.getElementById('add-task')
addTaskBtn.addEventListener('click', () => {
    const taskNum = tasks.length
    tasks.push('')
    renderTask(taskNum)
})
