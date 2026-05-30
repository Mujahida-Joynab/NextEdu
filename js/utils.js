/**
 * utils.js — Shared utility functions
 * NextEdu v2.4.1
 */

'use strict';

const Utils = (() => {

  /**
   * Safely query a DOM element; throws a clear error if missing.
   * @param {string} selector
   * @param {Element} [root=document]
   * @returns {Element}
   */
  function $(selector, root = document) {
    const el = root.querySelector(selector);
    if (!el) console.warn(`[Utils] Element not found: ${selector}`);
    return el;
  }

  /**
   * Query all matching elements.
   * @param {string} selector
   * @param {Element} [root=document]
   * @returns {NodeList}
   */
  function $$(selector, root = document) {
    return root.querySelectorAll(selector);
  }

  /**
   * Create an element with optional classes and inner HTML.
   * @param {string} tag
   * @param {string[]} [classes=[]]
   * @param {string} [html='']
   * @returns {Element}
   */
  function createElement(tag, classes = [], html = '') {
    const el = document.createElement(tag);
    if (classes.length) el.classList.add(...classes);
    if (html) el.innerHTML = html;
    return el;
  }

  /**
   * Debounce a function call.
   * @param {Function} fn
   * @param {number} delay — ms
   * @returns {Function}
   */
  function debounce(fn, delay = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  /**
   * Clamp a value between min and max.
   * @param {number} val
   * @param {number} min
   * @param {number} max
   * @returns {number}
   */
  function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  /**
   * Format a timestamp as a relative string ("2 minutes ago").
   * @param {Date} date
   * @returns {string}
   */
  function timeAgo(date) {
    const seconds = Math.floor((Date.now() - date) / 1000);
    if (seconds < 60)  return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  }

  /**
   * Escape HTML to prevent XSS.
   * @param {string} str
   * @returns {string}
   */
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Convert basic Markdown bold (**text**) to <strong>.
   * @param {string} text
   * @returns {string}
   */
  function markdownBold(text) {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  }

  /**
   * Convert newlines to <br> tags.
   * @param {string} text
   * @returns {string}
   */
  function nl2br(text) {
    return text.replace(/\n/g, '<br>');
  }

  return { $, $$, createElement, debounce, clamp, timeAgo, escapeHtml, markdownBold, nl2br };

})();

// Expose globally
window.Utils = Utils;