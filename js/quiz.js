/**
 * quiz.js — IRT Adaptive Quiz Engine & Topic Depth Selector
 * NextEdu v2.4.1
 */

'use strict';

const Quiz = (() => {

  /** Current IRT ability estimate (theta) */
  let theta = 0.8;
  let answered = false;

  // ── Depth Selector Messages ──────────────────────────────────
  const DEPTH_MESSAGES = {
    class6: `ঠিক আছে! 🎈 ধরো তুমি একটা বোতল ঢাকনা খুলছো। তুমি যত জোরে ঘোরাও, আর হাত যত দূরে রাখো — সেটাই Torque!`,
    hsc:    `টর্ক হলো ঘূর্ণনের কারণ। <strong>τ = r × F × sinθ</strong> — এই cross product-টাই সব রহস্য! 🔬`,
    bsc:    `Torque as a pseudovector: <strong>τ = r × F</strong>. Generalized torque: Q_θ = ∂L/∂θ. Angular impulse: ∫τdt = ΔL. 📐`,
    research: `In relativistic mechanics, torque is a 4-tensor. Spin-orbit coupling: dS/dt = μ × B. Berry phase connects to topological mechanics. 🚀`,
  };

  // ── AI Mode Messages ─────────────────────────────────────────
  const MODE_MESSAGES = {
    child:    `🧒 ধরো তুমি সুইং-এ বসে আছো। কেউ ধাক্কা দিলে তুমি ঘুরে যাও — সেই ঘোরানোর শক্তিটাই হলো Torque!`,
    story:    `📖 এক কামার লক্ষ্য করলেন লম্বা হাতলে পেরেক মারা সহজ। কারণ <strong>τ = r × F</strong> — দূরত্ব বাড়লে বেশি Torque!`,
    advanced: `🔬 Euler's equations: I₁ω̇₁ + (I₃-I₂)ω₂ω₃ = τ₁. Full 3D rotational dynamics in non-inertial frames.`,
  };

  /**
   * Set the AI explanation depth and update the AI bubble.
   * @param {HTMLElement} btn — the clicked depth button
   * @param {string} level — key in DEPTH_MESSAGES
   */
  function setDepth(btn, level) {
    document.querySelectorAll('.ds-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    _updateAiBubble(DEPTH_MESSAGES[level] || '');
  }

  /**
   * Switch the AI explanation mode (child, story, advanced).
   * @param {string} mode — key in MODE_MESSAGES
   */
  function changeMode(mode) {
    _updateAiBubble(MODE_MESSAGES[mode] || '');
  }

  /**
   * Handle an answer selection in the quiz.
   * @param {HTMLElement} el — the clicked option element
   * @param {boolean} isCorrect
   */
  function selectAnswer(el, isCorrect) {
    if (answered) return;
    answered = true;

    el.classList.add(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) {
      // Increase theta estimate
      theta = Math.min(3.0, theta + 0.3);
      _updateTheta(theta);
    }
  }

  /**
   * Reset quiz state (call when navigating back to topic).
   */
  function reset() {
    answered = false;
  }

  // ── Private Helpers ──────────────────────────────────────────

  function _updateAiBubble(html) {
    const bubble = document.getElementById('ai-message');
    if (bubble) {
      bubble.innerHTML = html + `<div class="typing"><span></span><span></span><span></span></div>`;
    }
  }

  function _updateTheta(value) {
    const numEl  = document.getElementById('theta-num');
    const fillEl = document.getElementById('theta-fill');
    if (numEl)  numEl.textContent = value.toFixed(1);
    if (fillEl) fillEl.style.width = `${Utils.clamp((value / 3.0) * 100, 0, 100)}%`;
  }

  // Expose on window for inline onclick handlers
  window.setDepth    = setDepth;
  window.changeMode  = changeMode;
  window.selectAnswer = selectAnswer;

  return { setDepth, changeMode, selectAnswer, reset };

})();

window.Quiz = Quiz;