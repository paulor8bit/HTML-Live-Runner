const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
    const runBtn = document.getElementById('run-btn');
    const htmlInput = document.getElementById('html-input');

    runBtn.addEventListener('click', () => {
        const htmlContent = htmlInput.value;
        if (htmlContent) {
            ipcRenderer.send('run-html', htmlContent);
        }
    });
});
