'use strict';
const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
if (menu && navigation) {
 menu.addEventListener('click', () => {
 const open = menu.getAttribute('aria-expanded') !== 'true';
 menu.setAttribute('aria-expanded', String(open));
 navigation.classList.toggle('is-open', open);
});
navigation.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
 menu.setAttribute('aria-expanded', 'false'); navigation.classList.remove('is-open');
}));
document.addEventListener('keydown', e => {
 if (e.key === 'Escape' && navigation.classList.contains('is-open')) {
  menu.setAttribute('aria-expanded', 'false'); navigation.classList.remove('is-open'); menu.focus();
 }
});
}

document.querySelectorAll('.mobile-menu').forEach(details => {
 const summary = details.querySelector('summary');
 details.addEventListener('toggle', () => {
  summary.setAttribute('aria-expanded', String(details.open));
  summary.setAttribute('aria-label', details.open ? '메뉴 닫기' : '메뉴 열기');
 });
 details.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  details.open = false;
 }));
 document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && details.open) { details.open = false; summary.focus(); }
 });
 document.addEventListener('click', e => {
  if (details.open && !details.contains(e.target)) details.open = false;
 });
});
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
 const filter = button.dataset.filter;
 document.querySelectorAll('[data-filter]').forEach(b => {
  const active = b === button; b.classList.toggle('selected', active); b.setAttribute('aria-pressed', String(active));
 });
 let count = 0;
 document.querySelectorAll('#lineup .game-card').forEach(card => {
  card.hidden = filter !== 'all' && card.dataset.category !== filter;
  if (!card.hidden) count++;
 });
 document.querySelector('#filter-result').textContent = `${button.textContent.trim()} 게임 ${count}개 표시`;
}));
const dialog = document.querySelector('.lightbox');
if (dialog) {
document.querySelectorAll('.gallery-open').forEach(button => button.addEventListener('click', () => {
 dialog.querySelector('img').src = button.dataset.image;
 dialog.querySelector('img').alt = button.dataset.caption;
 dialog.querySelector('p').textContent = button.dataset.caption;
 dialog.showModal(); document.body.classList.add('lightbox-open');
}));
dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', e => { if (e.target === dialog) {
 const box = dialog.getBoundingClientRect();
 if (e.clientX < box.left || e.clientX > box.right || e.clientY < box.top || e.clientY > box.bottom) dialog.close();
}});
dialog.addEventListener('close', () => document.body.classList.remove('lightbox-open'));
}
