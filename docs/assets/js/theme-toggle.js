(function () {
  var storageKey = 'machinesight-theme';
  var root = document.documentElement;
  var toggleButtons = document.querySelectorAll('[data-theme-toggle]');

  function getTheme() {
    return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  function getNextTheme(theme) {
    return theme === 'dark' ? 'light' : 'dark';
  }

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);

    try {
      localStorage.setItem(storageKey, theme);
    } catch (error) {
      // Ignore storage failures and keep the visual theme working.
    }

    toggleButtons.forEach(function (button) {
      var label = button.querySelector('[data-theme-toggle-label]');
      var nextTheme = getNextTheme(theme);

      button.setAttribute('aria-label', 'Switch to ' + nextTheme + ' mode');
      button.title = 'Switch to ' + nextTheme + ' mode';
      button.setAttribute('data-theme-current', theme);

      if (label) {
        label.textContent = 'Switch to ' + nextTheme + ' mode';
      }
    });
  }

  toggleButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      setTheme(getNextTheme(getTheme()));
    });
  });

  setTheme(getTheme());
})();