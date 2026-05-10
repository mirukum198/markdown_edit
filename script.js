const textInput = document.getElementById('textInput');
const increaseHeadingBtn = document.getElementById('increaseHeading');
const decreaseHeadingBtn = document.getElementById('decreaseHeading');
const copyTextBtn = document.getElementById('copyText');
const clearTextBtn = document.getElementById('clearText');
const notification = document.getElementById('notification');

function showNotification(message, type = 'success') {
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

increaseHeadingBtn.addEventListener('click', () => {
    const text = textInput.value;
    const result = text.replace(/^(#+)(\s)/gm, '$1#$2');
    textInput.value = result;
    showNotification('見出しレベルを上げました');
});

decreaseHeadingBtn.addEventListener('click', () => {
    const text = textInput.value;
    const result = text.replace(/^(##+)(\s)/gm, (match, hashes, space) => {
        return hashes.slice(1) + space;
    });
    textInput.value = result;
    showNotification('見出しレベルを下げました');
});

copyTextBtn.addEventListener('click', async () => {
    const text = textInput.value;

    if (!text) {
        showNotification('コピーするテキストがありません', 'error');
        return;
    }

    try {
        await navigator.clipboard.writeText(text);
        showNotification('クリップボードにコピーしました');
    } catch (err) {
        textInput.select();
        document.execCommand('copy');
        showNotification('クリップボードにコピーしました');
    }
});

clearTextBtn.addEventListener('click', () => {
    if (textInput.value && !confirm('テキストをクリアしてもよろしいですか?')) {
        return;
    }
    textInput.value = '';
    showNotification('テキストをクリアしました');
});

textInput.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'ArrowUp') {
        e.preventDefault();
        increaseHeadingBtn.click();
    }
    if (e.ctrlKey && e.shiftKey && e.key === 'ArrowDown') {
        e.preventDefault();
        decreaseHeadingBtn.click();
    }
});
