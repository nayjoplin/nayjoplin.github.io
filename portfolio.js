const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];

// Reading progress
const progress=document.createElement('div');progress.className='reading-progress';document.body.prepend(progress);
addEventListener('scroll',()=>{const h=document.documentElement;progress.style.width=`${(h.scrollTop/(h.scrollHeight-h.clientHeight))*100}%`});

// Mobile navigation
const nav=$('.nav-inner');if(nav){const b=document.createElement('button');b.className='menu-toggle';b.setAttribute('aria-label','Abrir menu');b.innerHTML='☰';nav.append(b);b.onclick=()=>$('.nav-links')?.classList.toggle('open')}

// Scroll reveal
const observer=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add('visible')),{threshold:.12});$$('section,.card,.smart-card,.media-tile,.process-step').forEach(el=>{el.classList.add('reveal');observer.observe(el)});

// Project filters
$$('[data-filter]').forEach(btn=>btn.onclick=()=>{const scope=btn.closest('section')||document;$$('[data-filter]',scope).forEach(x=>x.classList.remove('active'));btn.classList.add('active');const value=btn.dataset.filter;$$('[data-category]',scope).forEach(card=>card.hidden=value!=='all'&&!card.dataset.category.includes(value))});

// Gallery carousel + lightbox
$$('.dynamic-gallery').forEach(g=>{const track=$('.gallery-track',g),slides=$$('.gallery-slide',g);let i=0;const go=n=>{i=(n+slides.length)%slides.length;track.style.transform=`translateX(-${i*100}%)`;$$('.gallery-dot',g).forEach((d,k)=>d.classList.toggle('active',k===i))};$('.gallery-prev',g)?.addEventListener('click',()=>go(i-1));$('.gallery-next',g)?.addEventListener('click',()=>go(i+1));$$('.gallery-dot',g).forEach((d,k)=>d.onclick=()=>go(k));slides.forEach(s=>s.onclick=()=>{const box=document.createElement('div');box.className='lightbox';box.innerHTML=`<button aria-label="Fechar">×</button><img src="${$('img',s).src}" alt="${$('img',s).alt}">`;document.body.append(box);box.onclick=()=>box.remove()})});

// Expandable details
$$('.accordion-button').forEach(b=>b.onclick=()=>{const p=b.nextElementSibling;b.classList.toggle('open');p.hidden=!p.hidden});

// Copy/share
$$('[data-share]').forEach(b=>b.onclick=async()=>{try{await navigator.clipboard.writeText(location.href);b.textContent='LINK COPIADO ✓';setTimeout(()=>b.textContent='COMPARTILHAR CASE',1800)}catch{location.href=`mailto:?subject=${encodeURIComponent(document.title)}&body=${encodeURIComponent(location.href)}`}});

// Case navigation
const caseOrder=['hospital-microservices','okan-nexus','cv-builder','digital-bank','global-growth','ecommerce-growth','influencer-program','landing-page','brand-campaigns','ux-digital'];
const slug=location.pathname.split('/').pop()?.replace('.html','');if(location.pathname.includes('/cases/')&&slug){const idx=caseOrder.indexOf(slug);const nav=document.createElement('section');nav.className='case-next';const prev=caseOrder[(idx-1+caseOrder.length)%caseOrder.length],next=caseOrder[(idx+1)%caseOrder.length];nav.innerHTML=`<div class="container next-grid"><a href="${prev}.html"><small>CASE ANTERIOR</small><strong>← ${prev.replaceAll('-',' ')}</strong></a><a href="${next}.html"><small>PRÓXIMO CASE</small><strong>${next.replaceAll('-',' ')} →</strong></a></div>`;document.body.append(nav)}