(() => {
 'use strict';
 const tabs=[...document.querySelectorAll('[role=tab]')];
 function activate(tab,focus=false){tabs.forEach(t=>{const selected=t===tab;t.setAttribute('aria-selected',String(selected));t.tabIndex=selected?0:-1;document.getElementById(t.getAttribute('aria-controls')).hidden=!selected;});if(focus)tab.focus();}
 tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>activate(tab));tab.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight')next=(i+1)%tabs.length;else if(event.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=tabs.length-1;else return;event.preventDefault();activate(tabs[next],true);});});
 document.querySelectorAll('[data-platform-link]').forEach(link=>link.addEventListener('click',()=>{document.querySelector('#platform').value=link.dataset.platformLink;}));
 const form=document.querySelector('#brief');
 form.querySelector('button[type=submit]').disabled=false;
 form.addEventListener('submit',event=>{event.preventDefault();if(!form.reportValidity())return;const platform=form.elements.platform.value,stage=form.elements.stage.value,idea=form.elements.idea.value.trim();if(!idea){form.elements.idea.setCustomValidity('Please describe your idea.');form.elements.idea.reportValidity();return;}const body=`Hello T&K Studio,\n\nPlatform: ${platform}\nProject stage: ${stage}\n\n${idea}\n\nBest regards,`;
 const link=document.createElement('a');link.href=`mailto:tnkstudios@tn-k.com?subject=${encodeURIComponent(platform+' — Project enquiry')}&body=${encodeURIComponent(body)}`;link.click();document.querySelector('.form-status').textContent='Your email application should open. If it does not, email tnkstudios@tn-k.com directly.';});
 form.elements.idea.addEventListener('input',()=>form.elements.idea.setCustomValidity(''));
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 if('IntersectionObserver' in window&&!reduced.matches){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('revealed');observer.unobserve(entry.target);}}),{threshold:.07});document.querySelectorAll('.intro-grid,.studio-pillars,.section-title,.platform-card,.technical-list article,.process-grid article,.contact-grid').forEach(el=>{el.classList.add('reveal-ready');observer.observe(el);});}
})();
