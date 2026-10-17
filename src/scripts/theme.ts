// Dark mode. The choice is saved in localStorage and set as data-theme="dark" on <html>.
// The first paint is handled by the inline script in BaseLayout, so the page never flashes.
// Clicks on [data-theme-toggle] (the header button) flip it. The listener is delegated and
// added once, so it keeps working after every client-side navigation.

const STORAGE_KEY = "theme";
let bound = false;

export function initTheme() {
    if (bound) return;
    bound = true;

    document.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof Element) || !target.closest("[data-theme-toggle]")) return;
        setTheme(document.documentElement.dataset.theme !== "dark");
    });
}

function setTheme(dark: boolean) {
    if (dark) document.documentElement.dataset.theme = "dark";
    else delete document.documentElement.dataset.theme;
    try {
        localStorage.setItem(STORAGE_KEY, dark ? "dark" : "light");
    } catch {
        // private mode or blocked storage: the switch still works for this visit
    }
    document.dispatchEvent(new Event("themechange"));
}
