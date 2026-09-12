(function () {
  'use strict';
  // Presentation only: move the original controls; retain their IDs, names,
  // constraints, event handlers, form ownership and entitlement boundary.
  const copy = {
    uk: {trainingTitle:'Програма тренувань',nutritionTitle:'План харчування',trainingIntro:'Налаштуй формат, ціль і графік.',nutritionIntro:'Налаштуй дані тіла, активність і ціль.',format:'Формат і ціль',schedule:'Графік і навантаження',body:'Дані тіла',activity:'Активність і ціль',meals:'Режим харчування',advanced:'Додаткові налаштування',trainingHint:'Інвентар, силові показники, фаза циклу',nutritionHint:'Підготовка, етап програми, контекст навантаження',summary:'Твої налаштування',trainingAction:'Створити програму',nutritionAction:'Розрахувати раціон',reset:'Скинути параметри',missing:'Не вказано',place:'Формат',level:'Рівень',goal:'Ціль',days:'Днів на тиждень',duration:'Тривалість',weight:'Вага тіла',age:'Вік',height:'Зріст',activityLabel:'Активність',mealsLabel:'Прийомів їжі',kg:'кг',min:'хв',cm:'см',years:'років',where:'Де тренуєшся?',gym:'Зал',home:'Вдома',outdoor:'На вулиці',nutritionGender:'Стать',result:'Результат розрахунку',edit:'Змінити параметри',trainingEmpty:'Заповни параметри й натисни «Створити програму».',nutritionEmpty:'Заповни параметри й натисни «Розрахувати раціон».',pending:'Заповни обов’язкові поля',ready:'Параметри заповнено'},
    en: {trainingTitle:'Your training plan',nutritionTitle:'Your nutrition plan',trainingIntro:'Set your format, goal and schedule.',nutritionIntro:'Set your body data, activity and goal.',format:'Format and goal',schedule:'Schedule and workload',body:'Body data',activity:'Activity and goal',meals:'Meal routine',advanced:'Additional settings',trainingHint:'Equipment, strength data and cycle phase',nutritionHint:'Experience, program stage and training context',summary:'Your settings',trainingAction:'Create training plan',nutritionAction:'Calculate meal plan',reset:'Reset settings',missing:'Not entered',place:'Format',level:'Level',goal:'Goal',days:'Days per week',duration:'Duration',weight:'Body weight',age:'Age',height:'Height',activityLabel:'Activity',mealsLabel:'Meals per day',kg:'kg',min:'min',cm:'cm',years:'years',where:'Where do you train?',gym:'Gym',home:'Home',outdoor:'Outdoors',nutritionGender:'Sex',result:'Your results',edit:'Edit settings',trainingEmpty:'Complete the settings and select “Create training plan”.',nutritionEmpty:'Complete the settings and select “Calculate meal plan”.',pending:'Complete required fields',ready:'Settings complete'},
    ru: {trainingTitle:'Программа тренировок',nutritionTitle:'План питания',trainingIntro:'Настрой формат, цель и график.',nutritionIntro:'Укажи данные тела, активность и цель.',format:'Формат и цель',schedule:'График и нагрузка',body:'Данные тела',activity:'Активность и цель',meals:'Режим питания',advanced:'Дополнительные настройки',trainingHint:'Инвентарь, силовые показатели, фаза цикла',nutritionHint:'Подготовка, этап программы, контекст нагрузки',summary:'Твои настройки',trainingAction:'Создать программу',nutritionAction:'Рассчитать рацион',reset:'Сбросить параметры',missing:'Не указано',place:'Формат',level:'Уровень',goal:'Цель',days:'Дней в неделю',duration:'Длительность',weight:'Вес тела',age:'Возраст',height:'Рост',activityLabel:'Активность',mealsLabel:'Приёмов пищи',kg:'кг',min:'мин',cm:'см',years:'лет',where:'Где тренируешься?',gym:'Зал',home:'Дома',outdoor:'На улице',nutritionGender:'Пол',result:'Результат расчёта',edit:'Изменить параметры',trainingEmpty:'Заполни параметры и нажми «Создать программу».',nutritionEmpty:'Заполни параметры и нажми «Рассчитать рацион».',pending:'Заполни обязательные поля',ready:'Параметры заполнены'}
  };
  Object.assign(copy.uk,{labTitle:'Аналізи',labIntro:'Підбери панель і переглянь результати.',labAction:'Сформувати панель',labEmpty:'Обери параметри, щоб сформувати панель для обговорення з лікарем.',labContext:'Самопочуття і навантаження',labDetails:'Медичний контекст',labGuide:'Як працювати з аналізами',context:'Контекст',load:'Навантаження',symptoms:'Симптоми'});
  Object.assign(copy.en,{labTitle:'Lab tests',labIntro:'Build a panel and review your results.',labAction:'Build test panel',labEmpty:'Choose your settings to build a panel to discuss with your doctor.',labContext:'Wellbeing and training load',labDetails:'Medical context',labGuide:'Working with lab tests',context:'Context',load:'Training load',symptoms:'Symptoms'});
  Object.assign(copy.ru,{labTitle:'Анализы',labIntro:'Подбери панель и просмотри результаты.',labAction:'Сформировать панель',labEmpty:'Выбери параметры, чтобы сформировать панель для обсуждения с врачом.',labContext:'Самочувствие и нагрузка',labDetails:'Медицинский контекст',labGuide:'Как работать с анализами',context:'Контекст',load:'Нагрузка',symptoms:'Симптомы'});
  const word = key => (copy[document.documentElement.lang] || copy.uk)[key] || key;
  function element(tag, className, key) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (key) { node.dataset.studioCopy = key; node.textContent = word(key); }
    return node;
  }
  function init() {
    const root = document.querySelector('body.calculator-studio :is(#calculator,#labs)');
    if (!root) return;
    const kind = root.id === 'labs' ? 'lab' : root.dataset.singleModule;
    if (!['nutrition','training','lab'].includes(kind)) return;
    const panel = kind === 'lab' ? root.querySelector('.lab-protocol') : document.getElementById(kind + '-panel');
    const form = document.getElementById(kind + '-form');
    if (!panel || !form) return;
    if (kind === 'lab') {
      root.querySelector(':scope > .container').classList.add('calculator-wrap');
      panel.querySelector('.protocol-head').classList.add('panel-head');
      const guide = element('details','studio-advanced studio-lab-guide');
      guide.append(element('summary',null,'labGuide'));
      const content = element('div','studio-guide-content');
      const hero = document.querySelector('.module-hero');
      const medicalNote = hero?.querySelector('.module-hero-panel');
      if (medicalNote) { medicalNote.classList.add('studio-medical-note'); panel.querySelector('.panel-head').after(medicalNote); }
      if (hero) { hero.querySelector('h1').classList.add('visually-hidden'); content.append(hero); }
      [root.querySelector('.section-head'),root.querySelector('.labs-grid')].forEach(node => { if(node) content.append(node); });
      guide.append(content);
      panel.querySelector('#lab-review-panel').after(guide);
      root.querySelectorAll('.lab-result').forEach(node => node.classList.add('result-box'));
      // Keep review fields, filtering and its native submit in their original form.
      document.getElementById('lab-review-form').classList.add('studio-form');
    }
    const title = panel.querySelector('.panel-head h3');
    title.dataset.studioCopy = kind + 'Title';
    const intro = panel.querySelector('.panel-head p');
    intro.dataset.studioCopy = kind + 'Intro';
    const heading = document.querySelector('main > h1');
    if (heading) heading.dataset.studioCopy = kind + 'Title';
    const fields = new Map([...form.querySelectorAll('.form-group')].map(group => [group.querySelector('input,select')?.id, group]));
    const workspace = element('div','studio-workspace');
    form.before(workspace);
    workspace.append(form);
    form.classList.add('studio-form');
    function group(key, ids) {
      const section = element('section','studio-section');
      const h = element('h4','studio-section-title',key);
      h.id = kind + '-studio-' + key;
      section.setAttribute('aria-labelledby',h.id);
      const grid = element('div','studio-fields');
      section.append(h,grid);
      ids.forEach(id => { if (fields.has(id)) { grid.append(fields.get(id)); fields.delete(id); } });
      form.append(section);
      return grid;
    }
    if (kind === 'training') {
      group('format',['training-place','training-level','training-goal']);
      group('schedule',['training-days','duration','body-weight','training-program-mode','pain-status']);
    } else if (kind === 'nutrition') {
      group('body',['gender','age','height','weight']);
      group('activity',['activity','goal']);
      group('meals',['meals-count','diet-style']);
    } else {
      group('body',['lab-sex','lab-age']);
      group('labContext',['lab-goal','lab-training-load','lab-symptoms','lab-last-check']);
      group('labDetails',['lab-prostate-risk','lab-cycle']);
    }
    const advanced = element('details','studio-advanced');
    const advancedSummary = element('summary');
    advancedSummary.append(element('span',null,'advanced'),element('small',null,kind + 'Hint'));
    const advancedGrid = element('div','studio-fields');
    fields.forEach(field => advancedGrid.append(field));
    advanced.append(advancedSummary,advancedGrid);
    if (fields.size) form.append(advanced);

    // The safety-related pain selector remains outside the collapsed controls.
    ['training-place','training-days','training-program-mode','pain-status','activity','goal'].forEach(id => {
      document.getElementById(id)?.closest('.form-group')?.classList.add('studio-field-wide');
    });
    if (kind === 'training') {
      document.querySelector('label[for="training-place"]').dataset.studioCopy = 'where';
      document.querySelector('label[for="training-level"]').dataset.studioCopy = 'level';
      ['duration','body-weight'].forEach(id => document.getElementById(id).closest('.form-group').classList.add('studio-field-pair'));
    } else (kind === 'lab' ? ['lab-sex','lab-age'] : ['age','height','weight','gender']).forEach(id => document.getElementById(id).closest('.form-group').classList.add('studio-field-pair'));
    if (kind === 'lab') ['lab-prostate-risk','lab-cycle'].forEach(id => document.getElementById(id).closest('.form-group').classList.add('studio-field-wide'));

    const aside = element('aside','studio-sidebar');
    aside.setAttribute('aria-label',word('summary'));
    const summary = element('details','studio-summary');
    summary.open = matchMedia('(min-width: 1024px)').matches;
    summary.append(element('summary',null,'summary'));
    const list = element('dl','studio-summary-list');
    const summaryFields = kind === 'training'
      ? [['place','training-place'],['level','training-level'],['goal','training-goal'],['days','training-days'],['duration','duration','min'],['weight','body-weight','kg']]
      : kind === 'nutrition' ? [['nutritionGender','gender'],['age','age','years'],['height','height','cm'],['weight','weight','kg'],['goal','goal'],['activityLabel','activity'],['mealsLabel','meals-count']]
      : [['nutritionGender','lab-sex'],['age','lab-age','years'],['context','lab-goal'],['load','lab-training-load'],['symptoms','lab-symptoms']];
    const summaryValues = summaryFields.map(([key,id,unit]) => {
      const row = element('div'); const value = element('dd');
      row.append(element('dt',null,key),value); list.append(row);
      return {value,field:document.getElementById(id),unit};
    });
    summary.append(list);
    const status = element('p','studio-status');
    const actions = form.querySelector('.form-actions');
    actions.classList.add('studio-actions');
    const submit = actions.querySelector('[type="submit"]');
    submit.setAttribute('form',form.id);
    submit.dataset.studioCopy = kind + 'Action';
    const reset = actions.querySelector('#' + kind + '-reset');
    reset.dataset.studioCopy = 'reset';
    reset.classList.add('studio-reset');
    // Keep original buttons within the same paid panel (no new access path).
    aside.append(summary,status,reset,actions);
    workspace.append(aside);
    let sidebarFrame = 0;
    function fitSidebar() {
      if (sidebarFrame) return;
      sidebarFrame = requestAnimationFrame(() => {
        sidebarFrame = 0;
        if (!matchMedia('(min-width:1024px)').matches) return;
        const headerBottom = document.querySelector('.site-header')?.getBoundingClientRect().bottom || 0;
        aside.style.setProperty('--studio-sidebar-top',Math.max(headerBottom + 24,aside.getBoundingClientRect().top) + 'px');
      });
    }
    window.addEventListener('scroll',fitSidebar,{passive:true});
    window.addEventListener('resize',fitSidebar);
    const syncSegments = [];
    function segmented(id, labels) {
      const select = document.getElementById(id);
      if (!select) return;
      const host = element('div','studio-segments');
      host.setAttribute('role','radiogroup');
      const label = select.closest('.form-group').querySelector('label');
      label.id = id + '-studio-label';
      host.setAttribute('aria-labelledby',label.id);
      const buttons = [...select.options].map(option => {
        const button = element('button','studio-segment');
        button.type = 'button'; button.setAttribute('role','radio');
        button.dataset.value = option.value;
        button.textContent = labels ? word(labels[option.value]) : option.value;
        button.addEventListener('click',() => {
          if (select.disabled || button.disabled) return;
          select.value = option.value;
          select.dispatchEvent(new Event('input',{bubbles:true}));
          select.dispatchEvent(new Event('change',{bubbles:true}));
        });
        host.append(button); return button;
      });
      function sync() {
        buttons.forEach((button,index) => {
          const option = select.options[index];
          button.disabled = select.disabled || option.disabled;
          // New controls inherit the original entitlement state correctly.
          if (select.closest('.is-locked-module')) button.dataset.accessOriginalDisabled = String(option.disabled);
          const selected = option.value === select.value;
          button.setAttribute('aria-checked',String(selected));
          button.tabIndex = selected ? 0 : -1;
          if (labels) button.textContent = word(labels[option.value]);
        });
      }
      host.addEventListener('keydown',event => {
        if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key)) return;
        event.preventDefault();
        const enabled = buttons.filter(button => !button.disabled);
        if (!enabled.length) return;
        const index = enabled.indexOf(document.activeElement);
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? enabled.length - 1
          : (index + (['ArrowLeft','ArrowUp'].includes(event.key) ? -1 : 1) + enabled.length) % enabled.length;
        enabled[next].focus(); enabled[next].click();
      });
      select.after(host); select.classList.add('studio-native-select');
      select.tabIndex = -1; select.setAttribute('aria-hidden','true');
      select.addEventListener('change',sync);
      new MutationObserver(sync).observe(select,{attributes:true,attributeFilter:['disabled'],subtree:true});
      syncSegments.push(sync); sync();
    }
    if (kind === 'training') {
      segmented('training-place',{gym:'gym',home:'home',outdoor:'outdoor'});
      segmented('training-days');
    }
    function update() {
      summaryValues.forEach(({value,field,unit}) => {
        let text = field?.tagName === 'SELECT' ? field.selectedOptions[0]?.textContent.trim() : field?.value.trim();
        value.textContent = text ? text + (unit ? ' ' + word(unit) : '') : word('missing');
      });
      const complete = [...form.querySelectorAll('[required]')].every(field => field.value && field.validity.valid);
      status.textContent = word(complete ? 'ready' : 'pending');
      status.classList.toggle('is-complete',complete);
      syncSegments.forEach(sync => sync());
    }
    function localize() {
      document.querySelectorAll('[data-studio-copy]').forEach(node => { node.textContent = word(node.dataset.studioCopy); });
      aside.setAttribute('aria-label',word('summary'));
      update();
      fitSidebar();
    }
    form.addEventListener('input',update);
    form.addEventListener('change',update);
    form.addEventListener('reset',() => setTimeout(update,0));
    // Reveal invalid optional inputs in a closed details block before native focus.
    form.addEventListener('invalid',event => {
      const details = event.target.closest('details');
      if (details) details.open = true;
    },true);
    const result = document.getElementById(kind + '-result');
    const resultObserver = new MutationObserver(() => {
      const hasResult = !result.querySelector('.result-placeholder');
      panel.classList.toggle('studio-has-result',hasResult);
    });
    resultObserver.observe(result,{childList:true});
    if (kind === 'lab') {
      document.getElementById('lab-review-form').addEventListener('submit',() => requestAnimationFrame(() => document.getElementById('lab-review-result').scrollIntoView({block:'start'})));
    }
    form.addEventListener('submit',() => {
      requestAnimationFrame(() => {
        if (result.querySelector('.result-placeholder')) return;
        result.setAttribute('tabindex','-1');
        result.scrollIntoView({behavior:'auto',block:'start'});
        result.focus({preventScroll:true});
      });
    });
    const placeholder = result.querySelector('.result-placeholder');
    if (placeholder) placeholder.dataset.studioCopy = kind + 'Empty';
    const edit = element('button','studio-edit', 'edit');
    edit.type = 'button';
    edit.addEventListener('click',() => { form.scrollIntoView({block:'start'}); form.querySelector('input:not([disabled]),select:not([disabled]):not(.studio-native-select)')?.focus({preventScroll:true}); });
    result.after(edit);
    const viewport = window.visualViewport;
    function keyboardState() {
      const isTyping = document.activeElement?.matches('input,textarea');
      document.body.classList.toggle('studio-keyboard',Boolean(isTyping && viewport && viewport.height < window.innerHeight - 120));
    }
    viewport?.addEventListener('resize',keyboardState);
    document.addEventListener('focusin',event => {
      keyboardState();
      const field = event.target;
      if (!root.contains(field) || !field.matches('input,select,button,summary')) return;
      requestAnimationFrame(() => {
        const rect = field.getBoundingClientRect();
        const headerBottom = document.querySelector('.site-header')?.getBoundingClientRect().bottom || 0;
        const dockVisible = getComputedStyle(actions).position === 'fixed' && getComputedStyle(actions).visibility !== 'hidden' && actions.getBoundingClientRect().height;
        const bottom = dockVisible ? actions.getBoundingClientRect().top : window.innerHeight;
        if (!actions.contains(field) && (rect.top < headerBottom || rect.bottom > bottom)) field.scrollIntoView({block:'center',behavior:'instant'});
      });
    });
    document.addEventListener('focusout',() => requestAnimationFrame(keyboardState));
    new MutationObserver(localize).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
    const desktop = matchMedia('(min-width: 1024px)');
    desktop.addEventListener('change',() => { summary.open = desktop.matches; });
    localize();
    document.body.classList.add('studio-ready');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
