// theme.js — wires up the [data-theme-toggle] button + persists preference
const STORAGE_KEY = "theme";

const applyTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  document.querySelectorAll("[data-theme-toggle] .theme-label").forEach((el) => {
    el.textContent = theme === "dark" ? "Light" : "Dark";
  });
};

const currentTheme = () =>
  document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";

document.addEventListener("DOMContentLoaded", () => {
  applyTheme(currentTheme());
  document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = currentTheme() === "dark" ? "light" : "dark";
      localStorage.setItem(STORAGE_KEY, next);
      applyTheme(next);
    });
  });
});
