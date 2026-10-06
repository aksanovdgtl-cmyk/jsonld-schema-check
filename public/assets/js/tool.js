(function(){
  const root=document.getElementById('hzs-schema-tool');
  if(!root)return;

  const DICTIONARY={
    ru:{
      'form.mode.url':'По URL','form.mode.code':'Вставить код','form.url.label':'Адрес страницы','form.code.label':'JSON-LD','form.type.label':'Тип страницы','form.type.auto':'Определить автоматически','form.submit':'Проверить разметку ↗','form.note':'Проверка не вносит изменений на сайт и не сохраняет введенные данные.','stat.types':'типов разметки','stat.seconds':'секунд до результата',
      'state.loading':'Проверяем страницу','state.empty':'Пусто','state.ready':'Готово','state.retry':'Повторить проверку','state.analysis':'Идет анализ','state.result':'Результат проверки','state.complete':'Проверка завершена',
      'error.url.required':'Укажите адрес страницы','error.code.required':'Вставьте JSON-LD для проверки','error.request':'Не удалось выполнить проверку','error.domain':'Домен недоступен','error.timeout':'Сайт не ответил вовремя','error.redirect':'Сайт вернул неожиданный редирект','error.invalidInput':'Проверьте введенный адрес','error.emptyResponse':'Сайт вернул пустой ответ','error.blocked':'Сайт заблокировал проверку','error.invalidJson':'Во вкладке «Вставить код» указан невалидный JSON','error.json.empty':'JSON-LD пустой',
      'result.source':'Открыть проверенную страницу ↗','result.types':'Найденные типы','result.types.none':'Разметка не найдена','result.fix':'Что нужно исправить','result.code':'Готовый JSON-LD','result.status.error':'Ошибка','result.status.warning':'Рекомендация','result.status.ok':'Готово','result.title.good':'Разметка собрана корректно','result.title.improve':'Разметку нужно усилить','result.title.critical':'Есть критичные ошибки','result.title.url.good':'Разметка собрана хорошо','result.title.url.improve':'Разметку нужно усилить','result.title.url.critical':'Разметка требует исправлений','result.summary.code':'Проверили синтаксис, типы и ключевые свойства JSON-LD.','result.summary.url':'Проверили доступность страницы, сущности, домен и основные свойства структурированных данных.',
      'issue.context.title':'Нет @context','issue.context.text':'Добавьте https://schema.org.','issue.type.title':'Не указан @type','issue.type.text':'Задайте тип сущности Schema.org.','issue.name.title':'Нет названия','issue.name.text':'Добавьте name или headline.','issue.relative.title':'Относительный URL вместо абсолютного','issue.relative.text':'Используйте абсолютный URL.','issue.clean.title':'Критичных ошибок не найдено','issue.clean.text':'Синтаксис и ключевые свойства заполнены.','issue.syntax.title':'Ошибка синтаксиса','issue.property.title':'Спорное свойство','issue.gap.title':'Пропуск свойства',
      'button.copy':'Копировать','button.download':'Скачать','button.copied':'Скопировано',
      'placeholder.pageName':'Название страницы','placeholder.articleTitle':'Заголовок статьи','placeholder.author':'Автор','placeholder.company':'Название компании','placeholder.service':'Название услуги','placeholder.product':'Название товара',
      'api.name.label':'Название','api.name.copy':'Согласуйте название бренда в title, H1, og:site_name и разметке.','api.domain.label':'Домен','api.domain.copy':'Основной домен подтвержден техническими сигналами.','api.organization.label':'Организация','api.organization.copy':'Тип организации и описание читаются однозначно.','api.contacts.label':'Контакты','api.contacts.copy':'Телефон и почта подтверждают организацию.','api.profiles.label':'Профили','api.profiles.copy':'Добавьте sameAs минимум с двумя официальными профилями.','api.markup.label':'Разметка','api.markup.copy':'Разметка содержит основные свойства сущности.'
    },
    en:{
      'form.mode.url':'By URL','form.mode.code':'Paste code','form.url.label':'Page URL','form.code.label':'JSON-LD','form.type.label':'Page type','form.type.auto':'Detect automatically','form.submit':'Check markup ↗','form.note':'The check makes no changes to your site and does not store what you enter.','stat.types':'markup types','stat.seconds':'seconds to a result',
      'state.loading':'Checking the page','state.empty':'Empty','state.ready':'Ready','state.retry':'Run again','state.analysis':'Analysis in progress','state.result':'Check result','state.complete':'Check complete',
      'error.url.required':'Enter a page URL','error.code.required':'Paste JSON-LD to check','error.request':'The check could not be completed','error.domain':'The domain is unavailable','error.timeout':'The site did not respond in time','error.redirect':'The site returned an unexpected redirect','error.invalidInput':'Check the URL you entered','error.emptyResponse':'The site returned an empty response','error.blocked':'The site blocked the check','error.invalidJson':'The code in the Paste code tab is not valid JSON','error.json.empty':'The JSON-LD is empty',
      'result.source':'Open the checked page ↗','result.types':'Markup types found','result.types.none':'No markup found','result.fix':'What to fix','result.code':'Ready JSON-LD','result.status.error':'Error','result.status.warning':'Recommendation','result.status.ok':'Ready','result.title.good':'The markup is correct','result.title.improve':'The markup needs improvement','result.title.critical':'Critical errors found','result.title.url.good':'The markup is in good shape','result.title.url.improve':'The markup needs improvement','result.title.url.critical':'The markup needs fixes','result.summary.code':'We checked JSON-LD syntax, types, and key properties.','result.summary.url':'We checked page access, entities, the domain, and the main structured-data properties.',
      'issue.context.title':'Missing @context','issue.context.text':'Add https://schema.org.','issue.type.title':'Missing @type','issue.type.text':'Set a Schema.org entity type.','issue.name.title':'Missing name','issue.name.text':'Add name or headline.','issue.relative.title':'Relative URL instead of absolute','issue.relative.text':'Use an absolute URL.','issue.clean.title':'No critical errors found','issue.clean.text':'Syntax and key properties are filled in.','issue.syntax.title':'Syntax error','issue.property.title':'Disputed property','issue.gap.title':'Property gap',
      'button.copy':'Copy','button.download':'Download','button.copied':'Copied',
      'placeholder.pageName':'Page name','placeholder.articleTitle':'Article title','placeholder.author':'Author','placeholder.company':'Company name','placeholder.service':'Service name','placeholder.product':'Product name',
      'api.name.label':'Name','api.name.copy':'Align the brand name in title, H1, og:site_name, and the markup.','api.domain.label':'Domain','api.domain.copy':'The main domain is confirmed by technical signals.','api.organization.label':'Organization','api.organization.copy':'The organization type and description read clearly.','api.contacts.label':'Contacts','api.contacts.copy':'Phone and email confirm the organization.','api.profiles.label':'Profiles','api.profiles.copy':'Add at least two official profiles through sameAs.','api.markup.label':'Markup','api.markup.copy':'The markup contains the main entity properties.'
    }
  };

  const LANG=(root.dataset.lang||document.documentElement.lang||'ru').slice(0,2)==='en'?'en':'ru';
  const t=key=>DICTIONARY[LANG][key]||DICTIONARY.ru[key]||key;
  const form=root.querySelector('#hzs-form'),tabs=[...root.querySelectorAll('.hzs-tabs button')],type=root.querySelector('#hzs-type'),error=root.querySelector('#hzs-error'),loading=root.querySelector('#hzs-loading'),results=root.querySelector('#hzs-results'),button=form.querySelector('[type=submit]'),progress=root.querySelector('#hzs-progress'),percent=root.querySelector('#hzs-percent'),stages=[...root.querySelectorAll('#hzs-stages p')];
  let mode='url',lastCode='';
  const API='/api/tools/schema-check';
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));

  tabs.forEach(tab=>tab.addEventListener('click',()=>{
    mode=tab.dataset.mode;
    tabs.forEach(item=>item.classList.toggle('is-active',item===tab));
    const label=form.querySelector('label[for=hzs-input]');
    const old=root.querySelector('#hzs-input');
    const next=document.createElement(mode==='url'?'input':'textarea');
    next.id='hzs-input';next.required=true;
    if(mode==='url'){next.type='url';next.placeholder='https://example.com/service'}
    else{next.rows=7;next.placeholder='{"@context":"https://schema.org","@type":"Article"}'}
    old.replaceWith(next);
    label.textContent=mode==='url'?t('form.url.label'):t('form.code.label');
  }));

  function baseSchema(kind,url){
    const page=url||'https://example.com/service';
    const selected=kind==='auto'?'WebPage':kind;
    const data={'@context':'https://schema.org','@type':selected,url:page,name:t('placeholder.pageName')};
    if(selected==='Article'){data.headline=t('placeholder.articleTitle');data.datePublished=new Date().toISOString().slice(0,10);data.author={'@type':'Person',name:t('placeholder.author')}}
    if(selected==='Organization'||selected==='LocalBusiness'){data.name=t('placeholder.company');data.logo=page.replace(/\/$/,'')+'/logo.png';data.sameAs=[]}
    if(selected==='Service'){data.name=t('placeholder.service');data.provider={'@type':'Organization',name:t('placeholder.company')}}
    if(selected==='Product'){data.name=t('placeholder.product');data.image=page.replace(/\/$/,'')+'/image.jpg';data.offers={'@type':'Offer',priceCurrency:'KZT',availability:'https://schema.org/InStock'}}
    if(selected==='FAQPage')data.mainEntity=[];
    return data;
  }

  function parseCode(raw){
    const clean=raw.replace(/<script[^>]*>/gi,'').replace(/<\/script>/gi,'').trim();
    if(!clean)throw Error(t('error.json.empty'));
    try{return JSON.parse(clean)}catch(_){throw Error(t('error.invalidJson'))}
  }

  function analyseCode(raw){
    const data=parseCode(raw),nodes=Array.isArray(data)?data:(data['@graph']||[data]),types=[...new Set(nodes.flatMap(node=>Array.isArray(node['@type'])?node['@type']:[node['@type']]).filter(Boolean))],issues=[];
    let score=100;
    if(!nodes.length)throw Error(t('error.json.empty'));
    nodes.forEach((node,index)=>{
      if(!node['@context']&&!data['@context']&&index===0){score-=15;issues.push(['error',t('issue.context.title'),t('issue.context.text')])}
      if(!node['@type']){score-=20;issues.push(['error',t('issue.type.title'),t('issue.type.text')])}
      if(!node.name&&!node.headline){score-=10;issues.push(['warning',t('issue.name.title'),t('issue.name.text')])}
      ['url','image','logo'].forEach(key=>{if(node[key]&&typeof node[key]==='string'&&!/^https?:\/\//i.test(node[key])){score-=6;issues.push(['warning',t('issue.relative.title'),t('issue.relative.text')])}})
    });
    if(!issues.length)issues.push(['ok',t('issue.clean.title'),t('issue.clean.text')]);
    score=Math.max(0,score);
    return{score,types,issues,generated:JSON.stringify(data,null,2),title:score>=85?t('result.title.good'):score>=60?t('result.title.improve'):t('result.title.critical'),summary:t('result.summary.code')};
  }

  const apiLabels={'Название':'api.name.label','Домен':'api.domain.label','Организация':'api.organization.label','Контакты':'api.contacts.label','Профили':'api.profiles.label','Разметка':'api.markup.label'};
  const apiCopies={'Название':'api.name.copy','Домен':'api.domain.copy','Организация':'api.organization.copy','Контакты':'api.contacts.copy','Профили':'api.profiles.copy','Разметка':'api.markup.copy'};
  function requestError(status,message){
    if(status===403||/block|заблок/i.test(message))return t('error.blocked');
    if(status===408||status===504||/timeout|вовремя/i.test(message))return t('error.timeout');
    if(status>=300&&status<400)return t('error.redirect');
    if(status===400)return t('error.invalidInput');
    if(status===404||status>=500)return t('error.domain');
    return t('error.request');
  }

  async function analyseUrl(raw,kind){
    let url;
    try{url=new URL(/^https?:\/\//i.test(raw)?raw:'https://'+raw).href}catch(_){throw Error(t('error.invalidInput'))}
    const res=await fetch(API+'?url='+encodeURIComponent(url)+'&lang='+encodeURIComponent(LANG));
    let data;
    try{data=await res.json()}catch(_){throw Error(t('error.emptyResponse'))}
    if(!res.ok)throw Error(requestError(res.status,data&&data.error||''));
    if(!data||typeof data!=='object')throw Error(t('error.emptyResponse'));
    const issues=(data.issues||[]).map(function(item){
      return [item.severity==='error'?'error':item.severity==='warning'?'warning':'ok',item.title||t('issue.property.title'),item.copy||t('issue.relative.text')];
    });
    return{
      score:Number(data.score)||0,
      types:Array.isArray(data.types)?data.types:[],
      issues:issues.length?issues:[['ok',t('issue.clean.title'),t('issue.clean.text')]],
      generated:data.generated||JSON.stringify(baseSchema(kind,url),null,2),
      title:data.title||t('result.title.url.improve'),
      summary:data.summary||t('result.summary.url'),
      source:data.finalUrl||url
    };
  }

  function setProgress(value){
    value=Math.min(100,Math.max(0,Math.round(value)));
    progress.style.width=value+'%';percent.textContent=value+'%';
    stages.forEach((stage,index)=>stage.classList.toggle('is-done',value>=index*22+5));
  }

  function render(result){
    lastCode=result.generated;
    root.querySelector('#hzs-score strong').textContent=result.score;
    root.querySelector('#hzs-score').style.setProperty('--score',result.score*3.6+'deg');
    root.querySelector('#hzs-title').textContent=result.title;
    root.querySelector('#hzs-summary').textContent=result.summary;
    const source=root.querySelector('#hzs-source');source.hidden=!result.source;if(result.source)source.href=result.source;
    root.querySelector('#hzs-types').innerHTML=(result.types.length?result.types:[t('result.types.none')]).map(item=>'<b>'+esc(item)+'</b>').join('');
    root.querySelector('#hzs-issues').innerHTML=result.issues.map(item=>'<article class="hzs-issue '+(item[0]==='error'?'is-error':'')+'"><span>'+t(item[0]==='error'?'result.status.error':item[0]==='warning'?'result.status.warning':'result.status.ok')+'</span><h4>'+esc(item[1])+'</h4><p>'+esc(item[2])+'</p></article>').join('');
    root.querySelector('#hzs-code').textContent=result.generated;results.hidden=false;results.scrollIntoView({behavior:'smooth',block:'start'});
  }

  form.addEventListener('submit',async event=>{
    event.preventDefault();
    const field=root.querySelector('#hzs-input'),value=field.value.trim();
    if(!value){error.textContent=mode==='url'?t('error.url.required'):t('error.code.required');error.hidden=false;return}
    error.hidden=true;results.hidden=true;loading.hidden=false;button.disabled=true;button.textContent=t('state.loading');setProgress(2);
    const started=Date.now(),timer=setInterval(()=>setProgress(Math.min(94,((Date.now()-started)/10000)*94)),120);
    try{
      const task=mode==='url'?analyseUrl(value,type.value):Promise.resolve(analyseCode(value,type.value));
      const result=await task;await sleep(Math.max(0,10000-(Date.now()-started)));clearInterval(timer);setProgress(100);await sleep(350);loading.hidden=true;render(result);
    }catch(err){
      clearInterval(timer);await sleep(Math.max(0,10000-(Date.now()-started)));loading.hidden=true;error.textContent=err&&err.message||t('error.request');error.hidden=false;form.scrollIntoView({behavior:'smooth',block:'center'});
    }finally{button.disabled=false;button.textContent=t('form.submit')}
  });

  root.querySelector('#hzs-copy').addEventListener('click',async event=>{await navigator.clipboard.writeText(lastCode);event.currentTarget.textContent=t('button.copied');setTimeout(()=>event.currentTarget.textContent=t('button.copy'),1600)});
  root.querySelector('#hzs-download').addEventListener('click',()=>{const link=document.createElement('a'),url=URL.createObjectURL(new Blob([lastCode],{type:'application/ld+json'}));link.href=url;link.download='schema.jsonld';link.click();URL.revokeObjectURL(url)});
})();
