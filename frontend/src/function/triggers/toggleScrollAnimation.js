export function toggleScrollAnimation(className, duration = 0) {
    const content = document.querySelector(className);
    if (!content) return;

    content.classList.add('hide-scrollbar');

    setTimeout(() => {
        content.classList.remove('hide-scrollbar');
    }, duration);
}
