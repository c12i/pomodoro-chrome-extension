const timeOptionInput = document.getElementById('time-option-input')
timeOptionInput.addEventListener('change', (e) => {
    const { value } = e.target
    if (value < 1 || value > 60) {
        timeOptionInput.value = value < 1 ? 1 : 60
    }
})

const saveBtn = document.getElementById('save-btn')
saveBtn.addEventListener('click', () => {
    chrome.storage.local.set({
        timeOption: timeOptionInput.value,
        timer: 0,
        isRunning: false,
    })
    alert('Options Saved')
})

chrome.storage.local.get(['timeOption'], ({ timeOption }) => {
    timeOptionInput.value = timeOption ?? 25
})
