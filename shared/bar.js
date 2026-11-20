// Demobalk onderaan elke site: koppeling aan/uit, naar de andere sites, koppelingslog, opnieuw beginnen.
(function () {
  const here = document.body.dataset.site;
  const css = `
  #demobar{position:fixed;left:50%;bottom:14px;transform:translateX(-50%);z-index:9999;display:flex;align-items:center;gap:6px;
    background:#111827;color:#e5e7eb;border-radius:999px;padding:6px 8px 6px 14px;font:500 12.5px/1.2 Poppins,system-ui,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.25)}
  #demobar .tag{font-weight:700;letter-spacing:.06em;color:#fbbf24}
  #demobar a,#demobar button{all:unset;cursor:pointer;padding:6px 10px;border-radius:999px;color:#e5e7eb;white-space:nowrap}
  #demobar a:hover,#demobar button:hover{background:rgba(255,255,255,.1)}
  #demobar a.on{background:#fff;color:#111827}
  #demobar .sw{white-space:nowrap;display:flex;align-items:center;gap:6px;padding:4px 10px;border-radius:999px;background:rgba(255,255,255,.08)}
  #demobar .knob{width:30px;height:16px;border-radius:9px;background:#6b7280;position:relative;transition:.15s}
  #demobar .knob::after{content:'';position:absolute;top:2px;left:2px;width:12px;height:12px;border-radius:50%;background:#fff;transition:.15s}
  #demobar .sw.on .knob{background:#10b981}#demobar .sw.on .knob::after{left:16px}
  #demobar .sep{width:1px;height:18px;background:rgba(255,255,255,.18);margin:0 2px}
  #demobar .cnt{background:#3391ab;color:#fff;border-radius:999px;padding:1px 6px;margin-left:4px;font-size:11px}
  #demolog{position:fixed;right:16px;bottom:64px;width:min(460px,calc(100vw - 32px));max-height:60vh;overflow:auto;z-index:9998;background:#fff;color:#111827;
    border:1px solid #e5e7eb;border-radius:12px;box-shadow:0 12px 32px rgba(0,0,0,.18);font:13px/1.4 Poppins,system-ui,sans-serif;display:none}
  #demolog.open{display:block}
  #demolog h4{margin:0;padding:12px 14px;border-bottom:1px solid #f1f5f9;font-size:13px;display:flex;justify-content:space-between;position:sticky;top:0;background:#fff}
  #demolog .it{padding:8px 14px;border-bottom:1px solid #f8fafc;display:grid;grid-template-columns:58px 1fr;gap:8px}
  #demolog .it .t{color:#94a3b8;font-variant-numeric:tabular-nums}
  #demolog .it .r{font-size:11.5px;color:#64748b}
  #demolog .it.bad{background:#fff7ed}#demolog .it.bad .m{color:#9a3412}
  #demotoast{position:fixed;right:16px;top:16px;z-index:9999;display:flex;flex-direction:column;gap:8px;pointer-events:none}
  #demotoast div{background:#111827;color:#fff;font:13px/1.35 Poppins,system-ui,sans-serif;padding:10px 14px;border-radius:10px;max-width:380px;box-shadow:0 8px 20px rgba(0,0,0,.2);animation:dtin .2s ease-out}
  #demotoast div.bad{background:#9a3412}
  @keyframes dtin{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}
  @media print{#demobar,#demolog,#demotoast{display:none}}`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  const base = document.body.dataset.base || '..';
  const bar = document.createElement('div'); bar.id = 'demobar';
  const log = document.createElement('div'); log.id = 'demolog';
  const toast = document.createElement('div'); toast.id = 'demotoast';
  document.body.append(bar, log, toast);
  let seen = KKN.state.log.length, open = false;
  function render(s) {
    bar.innerHTML = `<span class="tag">DEMO</span>
      <span class="sw ${s.koppeling ? 'on' : ''}" id="db-sw" title="Schakel tussen vandaag (uit) en straks (aan)"><span class="knob"></span>Koppeling ${s.koppeling ? 'aan' : 'uit'}</span>
      <span class="sep"></span>
      <a href="${base}/calculatie/index.html" class="${here === 'calc' ? 'on' : ''}">Calculatie</a>
      <a href="${base}/boekhouding/index.html" class="${here === 'boek' ? 'on' : ''}">Boekhouding</a>
      <a href="${base}/crm/index.html" class="${here === 'crm' ? 'on' : ''}">CRM-KKN</a>
      <span class="sep"></span>
      <button id="db-log">Koppelingslog<span class="cnt">${s.log.length}</span></button>
      <a href="${base}/index.html" title="Startpagina en draaiboek">?</a>`;
    bar.querySelector('#db-sw').onclick = () => KKN.A.koppeling(!s.koppeling);
    bar.querySelector('#db-log').onclick = () => { open = !open; log.classList.toggle('open', open); };
    log.innerHTML = `<h4><span>Wat de systemen elkaar doorgeven</span><button id="db-reset" style="all:unset;cursor:pointer;color:#3391ab">Opnieuw beginnen</button></h4>` +
      s.log.map((l) => `<div class="it ${l.ok ? '' : 'bad'}"><span class="t">${l.t}</span><span><span class="r">${l.from}${l.to ? ' → ' + l.to : ''}</span><br><span class="m">${l.msg}</span></span></div>`).join('');
    log.querySelector('#db-reset').onclick = () => { if (confirm('Alle demogegevens terugzetten naar het begin?')) KKN.A.reset(); };
    // nieuwe meldingen kort tonen
    const fresh = s.log.length - seen; if (fresh > 0) s.log.slice(0, Math.min(fresh, 2)).reverse().forEach((l) => { const d = document.createElement('div'); if (!l.ok) d.className = 'bad'; d.textContent = (l.to ? l.from + ' → ' + l.to + ': ' : '') + l.msg; toast.appendChild(d); while (toast.children.length > 3) toast.firstChild.remove(); setTimeout(() => d.remove(), 5200); });
    seen = s.log.length;
  }
  KKN.on(render); render(KKN.state);
})();
