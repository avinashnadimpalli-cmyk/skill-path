(async ()=>{
  try {
    const res = await fetch('http://localhost:3000/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resume: 'test resume', targetJob: 'AE' })
    });
    console.log('STATUS', res.status);
    const txt = await res.text();
    console.log('BODY_RAW:', txt);
    try { console.log('BODY_JSON:', JSON.parse(txt)); } catch(e){ console.log('BODY_JSON_PARSE_ERR', e.message); }
  } catch (e) { console.error('ERR', e); }
})();
