(function(){
  function findAPI(win){
    let attempts=0;
    while(win && attempts<500){
      if(win.API) return win.API;
      attempts++;
      if(win.parent && win.parent!==win) win=win.parent; else break;
    }
    try{
      win=window.opener;
      attempts=0;
      while(win && attempts<500){ if(win.API) return win.API; attempts++; win=win.parent; }
    }catch(e){}
    return null;
  }
  const api = findAPI(window);
  let initialized=false, finished=false;
  function set(k,v){ try{ if(api) api.LMSSetValue(k,String(v)); }catch(e){} }
  function commit(){ try{ if(api) api.LMSCommit(''); }catch(e){} }
  window.EduScorm = {
    available: !!api,
    init(){
      if(api && !initialized){ try{ api.LMSInitialize(''); initialized=true; set('cmi.core.score.min',0); set('cmi.core.score.max',5); set('cmi.core.lesson_status','incomplete'); commit(); }catch(e){} }
    },
    report(payload){
      if(!api) return false;
      if(!initialized) this.init();
      const score = Number(payload.score || 0);
      set('cmi.core.score.min', payload.min ?? 0);
      set('cmi.core.score.max', payload.max ?? 5);
      set('cmi.core.score.raw', Math.max(0, Math.min(5, score)).toFixed(2));
      set('cmi.core.lesson_status', payload.status || (score>=3 ? 'passed' : 'failed'));
      if(payload.suspendData) set('cmi.suspend_data', payload.suspendData);
      if(payload.interactions && Array.isArray(payload.interactions)){
        payload.interactions.slice(0,100).forEach((x,i)=>{
          set(`cmi.interactions.${i}.id`, x.id || `q_${i+1}`);
          set(`cmi.interactions.${i}.type`, 'choice');
          set(`cmi.interactions.${i}.student_response`, String(x.submitted || '').slice(0,250));
          set(`cmi.interactions.${i}.result`, x.correct ? 'correct' : 'wrong');
        });
      }
      commit();
      if(!finished){ try{ api.LMSFinish(''); finished=true; }catch(e){} }
      return true;
    }
  };
  window.addEventListener('beforeunload',()=>{ if(api && initialized && !finished){ commit(); }});
})();
