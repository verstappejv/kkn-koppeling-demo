// Gedeelde demo-gegevens voor de drie sites (calculatie, boekhouding, CRM).
// Alles staat in localStorage van de browser: open de sites in dezelfde browser,
// dan ziet elke site direct wat een andere site doet. Alle namen en bedragen zijn verzonnen.
(function () {
  const KEY = 'kkn-demo-v1';
  const VERSION = 3;

  const LINES = () => [
    { art: 'PRF-W', omschr: 'Profiel wit (standaard)', qty: 56, unit: 'm', cost: 616, kind: 'backflush', group: 'Profielen' },
    { art: 'PRF-A', omschr: 'Profiel antraciet', qty: 24, unit: 'm', cost: 456, kind: 'perorder', group: 'Profielen' },
    { art: 'BSL-4', omschr: 'Beslagset draai-kiep', qty: 4, unit: 'st', cost: 152, kind: 'backflush', group: 'Beslag' },
    { art: 'GLS-HR', omschr: 'Glas HR++ op maat', qty: 16, unit: 'm²', cost: 992, kind: 'inkoop', group: 'Glas', supplier: 'Glashandel Oost (demo)' },
    { art: 'HOR-M', omschr: 'Hor op maat', qty: 2, unit: 'st', cost: 290, kind: 'inkoop', group: 'Horren', supplier: 'Horrenmakerij Zuid (demo)' },
    { art: 'VRS-1', omschr: 'Ventilatierooster', qty: 4, unit: 'st', cost: 192, kind: 'inkoop', group: 'Roosters', supplier: 'Ventilatie Noord (demo)' },
    { art: 'KLM', omschr: 'Kleinmateriaal (schroeven, kit, rubber)', qty: 1, unit: 'set', cost: 95, kind: 'backflush', group: 'Overig' },
  ];
  const scale = (f) => LINES().map((l) => ({ ...l, qty: Math.max(1, Math.round(l.qty * f)), cost: Math.round(l.cost * f) }));
  const terms = (excl) => [
    { key: 't30', label: 'Termijn 30%', pct: 0.3, status: 'wacht', when: 'Akkoord klant' },
    { key: 't60', label: 'Termijn 60%', pct: 0.6, status: 'wacht', when: 'Montage gereed' },
    { key: 'slot', label: 'Slottermijn 10%', pct: 0.1, status: 'wacht', when: '100% opgeleverd' },
  ];

  function seed() {
    const o = (x) => ({
      kkn: null, status: 'offerte', factory: '', step: 0, montage: 2150, restwerk: 180, hours: 28, rate: 48,
      exact: { project: true, fabOrder: null, inkoop: [], picked: false, backflushed: false, hoursBooked: false, montageBooked: false, restBooked: false, missing: [] },
      invoices: terms(x.excl), ...x,
    });
    const s = {
      v: VERSION, koppeling: true, nextKkn: 140231, seq: 1,
      orders: [
        o({ id: 'AR-2026-118', klant: 'Fam. de Vries', tel: '06-12345678', mail: 'devries@voorbeeld.nl', adres: 'Dorpsstraat 12', pc: '6871 AB', plaats: 'Renkum', vest: 'Arnhem', adm: 6, adviseur: 'J. Bakker', excl: 9950, bouwjaar: 2001, m2: 128, date: '2026-11-12', lines: LINES(), posities: 6, main: true }),
        o({ id: 'AR-2026-104', klant: 'Dhr. Pietersen', adres: 'Velperweg 88', pc: '6824 HL', plaats: 'Arnhem', vest: 'Arnhem', adm: 6, adviseur: 'J. Bakker', excl: 14200, bouwjaar: 1968, m2: 142, date: '2026-10-28', lines: scale(1.4), hours: 39, posities: 9, status: 'geaccepteerd', kkn: '140226', factory: 'in_productie', step: 6 }),
        o({ id: 'NM-2026-087', klant: 'Fam. Jansen', adres: 'Hatertseweg 410', pc: '6533 GW', plaats: 'Nijmegen', vest: 'Nijmegen', adm: 5, adviseur: 'Clement', excl: 7800, bouwjaar: 1985, m2: 110, date: '2026-10-02', lines: scale(0.8), hours: 22, posities: 5, status: 'geaccepteerd', kkn: '140198', factory: 'geleverd', step: 8, montage: 1750, restwerk: 0 }),
        o({ id: 'AM-2026-061', klant: 'Mevr. Smit', adres: 'Utrechtseweg 5', pc: '3811 NA', plaats: 'Amersfoort', vest: 'Amersfoort', adm: 9, adviseur: 'Joost', excl: 11400, bouwjaar: 1992, m2: 135, date: '2026-11-16', lines: scale(1.15), hours: 32, posities: 7 }),
        o({ id: 'EH-2026-140', klant: 'Bouwbedrijf Van Dam', adres: 'Kanaaldijk 3', pc: '5611 AA', plaats: 'Eindhoven', vest: 'Eindhoven', adm: 2, adviseur: 'Marcel', excl: 23800, bouwjaar: 1974, m2: 0, date: '2026-11-05', lines: scale(2.3), hours: 61, posities: 14, status: 'geaccepteerd', step: 5 }),
      ],
      stock: [
        { art: 'PRF-W', omschr: 'Profiel wit (standaard)', unit: 'm', adm: 1240, real: 1240, min: 400, price: 11 },
        { art: 'PRF-A', omschr: 'Profiel antraciet', unit: 'm', adm: 410, real: 410, min: 150, price: 19 },
        { art: 'BSL-4', omschr: 'Beslagset draai-kiep', unit: 'st', adm: 180, real: 180, min: 60, price: 38 },
        { art: 'KLM', omschr: 'Kleinmateriaal (schroeven, kit, rubber)', unit: 'set', adm: 75, real: 75, min: 25, price: 95 },
        { art: 'RUB-D', omschr: 'Rubber afdichting', unit: 'm', adm: 2600, real: 2600, min: 800, price: 1 },
      ],
      log: [],
    };
    // Voorbereide orders zo zetten alsof ze al door de koppeling liepen
    for (const ord of s.orders) {
      if (ord.status === 'geaccepteerd') ord.invoices[0].status = 'gefactureerd';
      if (ord.kkn) { ord.exact.fabOrder = ord.lines.map((l) => ({ ...l })); ord.exact.inkoop = ord.lines.filter((l) => l.kind === 'inkoop').map((l) => ({ ...l, kkn: ord.kkn, status: 'besteld' })); ord.exact.picked = true; }
      if (ord.factory === 'geleverd') { ord.exact.backflushed = true; ord.exact.hoursBooked = true; ord.exact.montageBooked = true; ord.invoices[0].status = 'betaald'; ord.invoices[0].paid = '2026-10-09'; ord.invoices[1].status = 'gefactureerd'; ord.exact.inkoop.forEach((i) => (i.status = 'ontvangen')); }
    }
    s.log.push({ t: stamp(), from: 'Systeem', to: '', msg: 'Demo klaargezet: vijf orders, vier vestigingen, één fabriek.', ok: true });
    return s;
  }

  function stamp() { const d = new Date(); return d.toTimeString().slice(0, 8); }
  function load() {
    try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.v === VERSION) return s; } catch (e) {}
    const s = seed(); save(s); return s;
  }
  function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }

  const listeners = [];
  let state = load();
  function emit() { save(state); listeners.forEach((f) => f(state)); }
  window.addEventListener('storage', (e) => { if (e.key === KEY) { state = load(); listeners.forEach((f) => f(state)); } });

  const eur = (n) => '€ ' + Math.round(n).toLocaleString('nl-NL');
  const eur2 = (n) => '€ ' + n.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const find = (id) => state.orders.find((o) => o.id === id);
  const log = (from, to, msg, ok = true) => state.log.unshift({ t: stamp(), from, to, msg, ok });
  const incl = (o) => o.excl * 1.21;
  const factoryCost = (o) => (o.exact.fabOrder || []).reduce((a, l) => a + l.cost, 0) + (o.exact.hoursBooked ? o.hours * o.rate : 0);
  const orderCost = (o) => factoryCost(o) + (o.exact.montageBooked ? o.montage : 0) + (o.exact.restBooked ? o.restwerk : 0);
  const calcCost = (o) => o.lines.reduce((a, l) => a + l.cost, 0) + o.hours * o.rate + o.montage;

  // Een factuur in de vestiging aanmaken (alleen met koppeling automatisch)
  function invoice(o, key) {
    const inv = o.invoices.find((i) => i.key === key);
    if (!inv || inv.status !== 'wacht') return;
    if (state.koppeling) { inv.status = 'gefactureerd'; inv.nr = 'VF' + o.adm + '-' + (26000 + state.seq++); log('CRM-KKN', 'Centrale administratie', `${inv.label} van ${o.id} klaargezet en gefactureerd in administratie ${o.adm}: ${eur(incl(o) * inv.pct)}`); }
    else { inv.status = 'handwerk'; log('CRM-KKN', '', `${inv.label} van ${o.id}: de centrale administratie moet hem met de hand maken`, false); }
  }

  const A = {
    // CRM: klant gaat akkoord
    akkoord(id) {
      const o = find(id); if (!o || o.status !== 'offerte') return;
      o.status = 'geaccepteerd'; o.step = Math.max(o.step, 1); o.decided = new Date().toISOString().slice(0, 10);
      log('CRM-KKN', '', `${o.klant} akkoord op ${o.id} (${eur(o.excl)} excl. btw)`);
      invoice(o, 't30');
      if (state.koppeling) log('CRM-KKN', 'Boekhouding ' + o.adm, `Project ${o.id} op status Opdracht gezet`);
      emit();
    },
    // CRM: volgende stap in de orderflow afronden
    stap(id) {
      const o = find(id); if (!o || o.status !== 'geaccepteerd') return;
      const next = o.step + 1;
      if (next === 6 && (!o.kkn || o.factoryHidden)) { alert(o.kkn ? 'Het KKN-nummer staat nog niet in het CRM. Tik het over (knop bij Fabriek) of zet de koppeling aan.' : 'Deze stap wacht op de werkvoorbereiding: geef de order eerst vrij voor productie in de calculatie-app.'); return; }
      if (next === 7 && o.factory !== 'gereed' && o.factory !== 'geleverd') { alert('Montage kan pas als de fabriek de order gereed heeft gemeld.'); return; }
      o.step = next;
      if (next === 7) { o.factory = 'geleverd'; montage(o); invoice(o, 't60'); }
      if (next === 9) { rest(o); invoice(o, 'slot'); }
      if (next === 10) log('CRM-KKN', '', `Orderflow ${o.kkn ? 'KKN ' + o.kkn : o.id} afgerond`);
      emit();
    },
    // Calculatie: werkvoorbereiding geeft vrij voor productie -> KKN
    vrijgeven(id) {
      const o = find(id); if (!o || o.kkn) return;
      if (o.status !== 'geaccepteerd') { alert('Alleen een geaccepteerde offerte kan naar productie. Zet de klant eerst op akkoord in het CRM.'); return; }
      o.kkn = String(state.nextKkn++); o.factory = 'in_productie';
      log('Calculatie', '', `Werkvoorbereiding: ${o.id} vrijgegeven, KKN ${o.kkn} aangemaakt (${o.posities} posities, ${o.lines.length} stuklijstregels)`);
      if (state.koppeling) {
        o.exact.fabOrder = o.lines.map((l) => ({ ...l }));
        o.exact.missing = [];
        o.exact.inkoop = o.lines.filter((l) => l.kind === 'inkoop').map((l) => ({ ...l, kkn: o.kkn, status: 'besteld' }));
        log('Calculatie', 'Boekhouding KK Nederland', `Fabrieksorder KKN ${o.kkn}: ${o.lines.length} van ${o.lines.length} regels overgekomen, ook horren en roosters`);
        log('Calculatie', 'Boekhouding KK Nederland', `${o.exact.inkoop.length} inkooporders met KKN ${o.kkn}: ${o.exact.inkoop.map((i) => i.group.toLowerCase()).join(', ')}`);
        pick(o);
        if (o.step === 5) o.step = 6;
        log('Calculatie', 'CRM-KKN', `KKN ${o.kkn} en status In productie bij ${o.id}`);
      } else {
        // Zo gaat het vandaag: roosters vallen weg, inkoop zonder ordernummer, CRM weet van niets
        o.exact.fabOrder = o.lines.filter((l) => l.group !== 'Roosters').map((l) => ({ ...l }));
        o.exact.missing = o.lines.filter((l) => l.group === 'Roosters').map((l) => l.omschr);
        o.exact.inkoop = [];
        log('Calculatie', 'Boekhouding KK Nederland', `Fabrieksorder: ${o.exact.fabOrder.length} van ${o.lines.length} regels overgekomen; ventilatieroosters ontbreken`, false);
        log('Calculatie', '', 'Inkoop van glas, horren en roosters buiten de boekhouding om besteld (geen ordernummer)', false);
        log('Calculatie', 'CRM-KKN', `KKN ${o.kkn} niet doorgegeven: moet met de hand in het CRM`, false);
        o.factoryHidden = true;
      }
      emit();
    },
    // Calculatie: productie meldt gereed -> backflush + uren
    gereed(id) {
      const o = find(id); if (!o || o.factory !== 'in_productie') return;
      o.factory = 'gereed';
      for (const l of o.lines.filter((x) => x.kind === 'backflush')) { const s = state.stock.find((x) => x.art === l.art); if (s) { s.real -= l.qty; if (state.koppeling) s.adm -= l.qty; } }
      if (state.koppeling) {
        o.exact.backflushed = true; o.exact.hoursBooked = true;
        o.exact.inkoop.forEach((i) => (i.status = 'ontvangen'));
        log('Calculatie', 'Boekhouding KK Nederland', `Gereedmelding KKN ${o.kkn}: standaardmateriaal afgeboekt volgens stuklijst (backflush), ${o.hours} fabrieksuren geboekt`);
        log('Calculatie', 'CRM-KKN', `KKN ${o.kkn}: Gereed voor levering`);
      } else {
        log('Calculatie', '', `KKN ${o.kkn} gereed. Voorraad niet afgeboekt en uren niet op de order: de boekhouding loopt achter op het magazijn`, false);
      }
      emit();
    },
    // CRM: KKN met de hand overtikken (zonder koppeling)
    overtikken(id) { const o = find(id); if (!o || !o.factoryHidden) return; o.factoryHidden = false; log('CRM-KKN', '', `KKN ${o.kkn} met de hand overgetikt bij ${o.id}`, false); if (o.step === 5) o.step = 6; emit(); },
    // Boekhouding: betaling van een termijnfactuur verwerken
    betaal(id, key) {
      const o = find(id); const inv = o && o.invoices.find((i) => i.key === key); if (!inv || !['gefactureerd', 'handwerk'].includes(inv.status)) return;
      inv.status = 'betaald'; inv.paid = new Date().toISOString().slice(0, 10);
      log('Boekhouding ' + o.adm, state.koppeling ? 'CRM-KKN' : '', `Betaling ${inv.label} ${o.id} ontvangen: ${eur(incl(o) * inv.pct)}${state.koppeling ? '; het CRM toont nu Betaald' : ' (het CRM weet dit niet)'}`, state.koppeling);
      emit();
    },
    // Boekhouding: factuur alsnog met de hand maken (zonder koppeling)
    handfactuur(id, key) { const o = find(id); const inv = o && o.invoices.find((i) => i.key === key); if (!inv || inv.status !== 'handwerk') return; inv.status = 'gefactureerd'; inv.nr = 'VF' + o.adm + '-' + (26000 + state.seq++); log('Boekhouding ' + o.adm, '', `${inv.label} ${o.id} met de hand aangemaakt`); emit(); },
    // Magazijn telt
    tel() { state.stock.forEach((s) => { if (s.adm !== s.real) log('Telling', 'Boekhouding KK Nederland', `${s.omschr}: administratie ${s.adm} ${s.unit}, geteld ${s.real} ${s.unit}`, false); }); emit(); },
    corrigeer() { state.stock.forEach((s) => (s.adm = s.real)); log('Boekhouding KK Nederland', '', 'Voorraad gecorrigeerd naar de telling'); emit(); },
    koppeling(on) { state.koppeling = on; log('Demo', '', on ? 'Koppeling AAN: zo werkt het straks' : 'Koppeling UIT: zo gaat het vandaag', on); emit(); },
    nieuweOfferte() {
      const n = state.orders.filter((o) => o.vest === 'Arnhem').length + 120;
      const o = { id: 'AR-2026-' + n, klant: 'Nieuwe klant ' + (n - 119), adres: 'Voorbeeldstraat ' + n, pc: '6811 AA', plaats: 'Arnhem', vest: 'Arnhem', adm: 6, adviseur: 'J. Bakker', excl: 8600, bouwjaar: 1999, m2: 115, date: new Date().toISOString().slice(0, 10), lines: scale(0.9), posities: 5, kkn: null, status: 'offerte', factory: '', step: 0, montage: 1900, restwerk: 0, hours: 25, rate: 48, exact: { project: true, fabOrder: null, inkoop: [], picked: false, backflushed: false, hoursBooked: false, montageBooked: false, restBooked: false, missing: [] }, invoices: terms(8600) };
      state.orders.unshift(o);
      log('Calculatie', 'Boekhouding 6', `Offerte ${o.id} gemaakt en als project in de boekhouding van Arnhem gezet`);
      log('Calculatie', 'CRM-KKN', `Offerte ${o.id} in het CRM`);
      emit(); return o.id;
    },
    reset() { state = seed(); emit(); },
  };
  function pick(o) { if (o.exact.picked) return; for (const l of o.lines.filter((x) => x.kind === 'perorder')) { const s = state.stock.find((x) => x.art === l.art); if (s) { s.real -= l.qty; s.adm -= l.qty; } } o.exact.picked = true; log('Magazijn', 'Boekhouding KK Nederland', `Profiel antraciet uitgegeven op KKN ${o.kkn} (per order afgeboekt)`); }
  function montage(o) { if (state.koppeling && o.kkn) { o.exact.montageBooked = true; log('CRM-KKN', 'Boekhouding ' + o.adm, `Montagekosten ${eur(o.montage)} geboekt op KKN ${o.kkn}`); } else log('CRM-KKN', '', `Montagekosten ${o.id} komen binnen zonder ordernummer`, false); }
  function rest(o) { if (state.koppeling && o.kkn) { o.exact.restBooked = true; if (o.restwerk) log('CRM-KKN', 'Boekhouding ' + o.adm, `Restwerk ${eur(o.restwerk)} geboekt op KKN ${o.kkn}; nacalculatie klaar`); } }

  window.KKN = {
    get state() { return state; }, on(f) { listeners.push(f); }, A, eur, eur2, find, incl, factoryCost, orderCost, calcCost,
    ADM: { 0: 'KK Nederland B.V. (fabriek)', 2: 'Eindhoven', 4: 'Almere', 5: 'Nijmegen', 6: 'Arnhem', 9: 'Amersfoort', 10: 'Steenwijk', 11: 'Hillegom', 12: 'Vechtdal' },
  };
})();
