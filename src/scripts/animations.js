import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const themeToggle = document.querySelector('#togglebuttondark');
const headlineSwitch = document.querySelector('#switch');
const headline = document.querySelector('#headline');
const replayButton = document.querySelector('#replay');
const contactForm = document.querySelector('#contact-form');
const contactDialog = document.querySelector('#modal');
const closeDialogButton = document.querySelector('#close-modal');

themeToggle?.addEventListener('click', () => {
  const isDark = document.documentElement.classList.toggle('dark');
  themeToggle.setAttribute('aria-pressed', String(isDark));

  if (!prefersReducedMotion) {
    gsap.to(themeToggle, {
      rotation: '+=360',
      duration: 0.6,
      ease: 'power2.out',
    });
  }
});

headlineSwitch?.addEventListener('click', () => {
  if (!headline) return;

  headline.textContent = headline.textContent.includes('We design resilient backends')
    ? '"Data structure integrity and clean programmatic execution are non-negotiable parameters. I construct software ecosystems that turn technical complexity into business capital."'
    : '"We design resilient backends and high-performance user interfaces optimized for speed, scalability, and seamless user experiences."';
});

const introTimeline = gsap.timeline({
  defaults: {
    duration: 0.8,
    ease: 'power3.out',
  },
});

const portfolioHeader = document.querySelector('.portfolio-header');
if (portfolioHeader && !prefersReducedMotion) {
  introTimeline.fromTo(
    portfolioHeader,
    { opacity: 0, scale: 0.95, y: -15 },
    { opacity: 1, scale: 1, y: 0, duration: 1, ease: 'back.out(1.2)' },
  );
}

const navigationLinks = document.querySelectorAll('nav[aria-label="Section navigation"] a');
if (navigationLinks.length > 0 && !prefersReducedMotion) {
  introTimeline.from(
    navigationLinks,
    { y: -12, opacity: 0, stagger: 0.1, duration: 0.5, ease: 'power2.out' },
    '-=0.4',
  );
}

if (!prefersReducedMotion) {
  gsap.utils.toArray('main section').forEach((section) => {
    gsap.fromTo(
      section,
      { y: 25, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          end: 'top 55%',
          scrub: 0.4,
          invalidateOnRefresh: true,
        },
      },
    );
  });
}

replayButton?.addEventListener('click', () => {
  if (!prefersReducedMotion) introTimeline.restart();
  window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
});

let emailDraftUrl = '';
if (contactForm instanceof HTMLFormElement && contactDialog instanceof HTMLDialogElement) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = String(formData.get('name') ?? '');
    const email = String(formData.get('email') ?? '');
    const message = String(formData.get('message') ?? '');
    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(`${name} (${email}) wrote:\n\n${message}`);

    emailDraftUrl = `mailto:c20245391.vinson@csav.edu.ph?subject=${subject}&body=${body}`;
    contactForm.reset();
    contactDialog.showModal();
  });
}

closeDialogButton?.addEventListener('click', () => {
  if (contactDialog instanceof HTMLDialogElement) contactDialog.close();
  if (emailDraftUrl) window.location.href = emailDraftUrl;
});

contactDialog?.addEventListener('click', (event) => {
  if (event.target === contactDialog && contactDialog instanceof HTMLDialogElement) {
    contactDialog.close();
  }
});

window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
