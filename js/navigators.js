/**
 * navigation.js — Screen routing & bottom-nav state management
 * NextEdu v2.4.1
 */

'use strict';

const Navigation = (() => {

  /** Maps screen names to their bottom-nav item IDs */
  const NAV_MAP = {
    home:        'home',
    subjects:    'subjects',
    chapters:    'subjects',
    topic:       'subjects',
    quiz:        'quiz',
    ai:          'ai',
    insights:    'insights',
    provenance:  'provenance',
  };

  /**
   * Show a screen by name and update the bottom nav.
   * @param {string} name
   */
  function showScreen(name) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));

    // Show target
    const screen = document.getElementById(`screen-${name}`);
    if (screen) {
      screen.classList.add('active');
    } else {
      console.warn(`[Navigation] Screen not found: screen-${name}`);
    }

    // Update nav
    const navTarget = NAV_MAP[name] || 'home';
    setNav(navTarget);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  /**
   * Highlight the correct bottom-nav item.
   * @param {string} name
   */
  function setNav(name) {
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const el = document.getElementById(`nav-${name}`);
    if (el) el.classList.add('active');
  }

  /**
   * Toggle a chapter accordion open/closed.
   * @param {string} id — element ID of the chapter card
   */
  function toggleChapter(id) {
    const card    = document.getElementById(id);
    if (!card) return;
    const topics  = card.querySelector('.ch-topics');
    const chevron = card.querySelector('.ch-chevron');
    const isOpen  = topics.classList.contains('open');

    // Close all
    document.querySelectorAll('.ch-topics').forEach(t => {
      t.classList.remove('open');
      t.style.display = 'none';
    });
    document.querySelectorAll('.ch-chevron').forEach(c => c.classList.remove('open'));
    document.querySelectorAll('.chapter-card').forEach(c => c.classList.remove('open'));

    // Open clicked one if it was closed
    if (!isOpen) {
      topics.classList.add('open');
      topics.style.display = 'block';
      chevron.classList.add('open');
      card.classList.add('open');
    }
  }

  /** Initialize default accordion state on page load */
  function initChapters() {
    // Hide all closed topics, show open ones
    document.querySelectorAll('.ch-topics:not(.open)').forEach(t => {
      t.style.display = 'none';
    });
    const openTopic = document.querySelector('.ch-topics.open');
    if (openTopic) openTopic.style.display = 'block';
  }

  // Expose on window for inline onclick handlers
  window.showScreen    = showScreen;
  window.setNav        = setNav;
  window.toggleChapter = toggleChapter;

  return { showScreen, setNav, toggleChapter, initChapters };

})();

window.Navigation = Navigation;