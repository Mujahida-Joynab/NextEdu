/**
 * provenance.js — Provenance screen logic
 * Tabs, tag inputs, MCP servers, prompts, permission toggles, audit trail
 * NextEdu v2.4.1
 */

'use strict';

const Provenance = (() => {

  let promptNextId = 4;

  // ── Tab Switching ─────────────────────────────────────────────
  /**
   * @param {string} tab — section ID suffix (data, tooling, mcp, prompts, rai)
   * @param {HTMLElement} clickedBtn
   */
  function switchProvTab(tab, clickedBtn) {
    document.querySelectorAll('.ptab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.prov-section').forEach(s => s.classList.remove('active'));

    if (clickedBtn) clickedBtn.classList.add('active');
    const section = document.getElementById(`ptab-${tab}`);
    if (section) section.classList.add('active');
  }

  // ── Tag Input ─────────────────────────────────────────────────
  function focusTagInput(id) {
    const el = document.getElementById(id);
    if (el) el.focus();
  }

  /**
   * Add a tag chip on Enter keypress.
   * @param {KeyboardEvent} e
   * @param {string} wrapId — ID of the tag-input-wrap container
   * @param {string} [style=''] — extra CSS class for the chip ('purple','cyan','pink')
   */
  function addTag(e, wrapId, style = '') {
    if (e.key !== 'Enter') return;
    const input = e.target;
    const val = input.value.trim();
    if (!val) return;

    const chip = Utils.createElement('div', ['tag-chip'], '');
    if (style) chip.classList.add(style);
    chip.innerHTML = Utils.escapeHtml(val) +
      `<span class="remove-tag" onclick="Provenance.removeTag(this)">✕</span>`;

    const wrap = document.getElementById(wrapId);
    if (wrap) wrap.insertBefore(chip, input);
    input.value = '';
  }

  /** Styled tag helpers for inline onkeydown handlers */
  function addTagStyled(e, wrapId, style) {
    addTag(e, wrapId, style);
  }

  /**
   * Remove a tag chip.
   * @param {HTMLElement} el — the ✕ span
   */
  function removeTag(el) {
    el.parentElement.remove();
  }

  // ── MCP Servers ───────────────────────────────────────────────
  function addMcpServer() {
    const list = document.getElementById('mcp-servers-list');
    if (!list) return;

    const item = Utils.createElement('div', ['mcp-item'], `
      <div class="mcp-item-header">
        <div class="mcp-dot" style="background:var(--amber)"></div>
        <input class="mcp-name-input" placeholder="Server name..." />
        <span class="mcp-server-label">Server</span>
      </div>
      <input class="mcp-purpose-input" placeholder="Purpose of this MCP server...">
    `);
    list.appendChild(item);
    item.querySelector('.mcp-name-input').focus();
  }

  // ── Permission Toggles ────────────────────────────────────────
  function togglePerm(el) {
    el.classList.toggle('on');
  }

  // ── Prompt Library ────────────────────────────────────────────
  function openAddPrompt() {
    const form = document.getElementById('add-prompt-form');
    if (form) {
      form.style.display = 'block';
      document.getElementById('new-prompt-title')?.focus();
    }
  }

  function saveNewPrompt() {
    const title = document.getElementById('new-prompt-title')?.value.trim();
    const text  = document.getElementById('new-prompt-text')?.value.trim();
    const type  = document.getElementById('new-prompt-type')?.value || 'system';
    if (!title || !text) return;

    const card = Utils.createElement('div', ['prompt-card'], `
      <button class="prompt-del" onclick="Provenance.deletePrompt(this)">✕</button>
      <div class="prompt-card-title">${Utils.escapeHtml(title)}</div>
      <div class="prompt-card-text">${Utils.escapeHtml(text)}</div>
      <div class="prompt-card-meta">
        <span class="prompt-meta-chip">${Utils.escapeHtml(type)}</span>
        <span class="prompt-meta-chip active-chip">✓ New</span>
      </div>
    `);
    card.dataset.id = promptNextId++;

    const list = document.getElementById('prompt-list');
    if (list) list.appendChild(card);

    // Reset form
    document.getElementById('add-prompt-form').style.display = 'none';
    document.getElementById('new-prompt-title').value = '';
    document.getElementById('new-prompt-text').value  = '';
    _updatePromptCount();
  }

  function deletePrompt(btn) {
    btn.closest('.prompt-card').remove();
    _updatePromptCount();
  }

  function _updatePromptCount() {
    const n     = document.querySelectorAll('#prompt-list .prompt-card').length;
    const label = document.getElementById('prompt-count-label');
    if (label) label.textContent = `${n} prompt${n !== 1 ? 's' : ''} recorded`;
  }

  // ── Save Provenance ───────────────────────────────────────────
  function saveProvenance() {
    const btn = document.querySelector('.prov-save-btn');
    if (!btn) return;

    btn.textContent = '✓ Saved!';
    btn.style.background = 'linear-gradient(135deg,var(--teal),var(--emerald))';

    // Add to audit trail
    const trail = document.getElementById('audit-trail');
    if (trail) {
      const item = Utils.createElement('div', ['audit-item'], `
        <div class="audit-icon teal">💾</div>
        <div class="audit-text">
          <div class="audit-title">Provenance record saved manually</div>
          <div class="audit-time">Just now • by Rafi Ahmed</div>
        </div>
      `);
      trail.insertBefore(item, trail.firstChild);
    }

    setTimeout(() => {
      btn.textContent = '💾 Save Provenance Record';
      btn.style.background = '';
    }, 2500);
  }

  // Expose on window for inline onclick handlers
  window.switchProvTab   = switchProvTab;
  window.focusTagInput   = focusTagInput;
  window.addTag          = addTag;
  window.addTagStyled    = addTagStyled;
  window.removeTag       = (el) => removeTag(el);
  window.addMcpServer    = addMcpServer;
  window.togglePerm      = togglePerm;
  window.openAddPrompt   = openAddPrompt;
  window.saveNewPrompt   = saveNewPrompt;
  window.deletePrompt    = (el) => deletePrompt(el);
  window.saveProvenance  = saveProvenance;

  return {
    switchProvTab, focusTagInput, addTag, addTagStyled, removeTag,
    addMcpServer, togglePerm, openAddPrompt, saveNewPrompt,
    deletePrompt, saveProvenance,
  };

})();

window.Provenance = Provenance;