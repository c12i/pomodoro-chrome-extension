chrome.alarms.create('pomodoro-timer', {
    periodInMinutes: 1 / 60,
})

chrome.storage.local.get(['timer', 'isRunning'], (res) => {
    chrome.storage.local.set({
        timer: 'timer' in res ? res.timer : 0,
        isRunning: 'isRunning' in res ? res.isRunning : false,
        timeOption: 'timeOption' in res ? res.timeOption : 25,
    })
})

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'pomodoro-timer') {
        chrome.storage.local.get(
            ['timer', 'isRunning', 'timeOption'],
            (res) => {
                if (res.isRunning) {
                    let timer = res.timer + 1
                    let isRunning = true
                    if (timer === 60 * res.timeOption) {
                        this.registration.showNotification('Pomodoro Timer', {
                            body: `${res.timeOption} minutes has passed`,
                            icon: '../icons/tomato.png',
                        })
                        timer = 0
                        isRunning = false
                    }
                    chrome.storage.local.set({ timer, isRunning })
                }
            }
        )
    }
})
