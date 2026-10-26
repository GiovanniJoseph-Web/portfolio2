"use strict";

/* =====================================================================
   EDIT HERE: your projects
   Add a project = put its screenshot in assets/projects/ + add an object.
   - liveUrl / githubUrl: leave "" until the project is deployed / pushed.
     The matching button is disabled automatically while the URL is empty.
   - description / technologies: empty means "placeholder shown on the card".
   ===================================================================== */
const projects = [
  {
    id: 1,
    title: "Burger Hub",
    category: "Restaurant Website",
    description: "A responsive restaurant landing page with interactive menus and smooth layout transitions, built mobile-first.",
    technologies: ["HTML5", "CSS3", "JavaScript", "Bootstrap"],
    image: "assets/projects/burger-hub.jpg",
    liveUrl: "",
    githubUrl: ""
  },
  {
    id: 2,
    title: "FitLife",
    category: "Fitness Website",
    description: "A fitness and health platform landing page (Arabic, right-to-left) highlighting workout programs and membership options.",
    technologies: ["HTML5", "CSS3", "JavaScript", "Bootstrap"],
    image: "assets/projects/fitlife.jpg",
    liveUrl: "",
    githubUrl: ""
  },
  {
    id: 3,
    title: "Turto",
    category: "Tutoring Platform",
    description: "",   // TODO: describe this project
    technologies: [],  // TODO: list the technologies used
    image: "assets/projects/turto.jpg",
    liveUrl: "",
    githubUrl: ""
  },
  {
    id: 4,
    title: "Family Bakery",
    category: "Bakery Website",
    description: "",   // TODO
    technologies: [],  // TODO
    image: "assets/projects/family-bakery.jpg",
    liveUrl: "",
    githubUrl: ""
  },
  {
    id: 5,
    title: "TechConsult",
    category: "Business Website",
    description: "",   // TODO
    technologies: [],  // TODO
    image: "assets/projects/techconsult.jpg",
    liveUrl: "",
    githubUrl: ""
  },
  {
    id: 6,
    title: "Coffee",
    category: "Cafe Website",
    description: "",   // TODO
    technologies: [],  // TODO
    image: "assets/projects/coffee-shop.jpg",
    liveUrl: "",
    githubUrl: ""
  },
  {
    id: 7,
    title: "Creative Agency",
    category: "Agency Website",
    description: "",   // TODO
    technologies: [],  // TODO
    image: "assets/projects/creative-agency.jpg",
    liveUrl: "",
    githubUrl: ""
  }
];

/* EDIT HERE: your skills (taken from your CV) */
const skills = [
  { group: "Frontend Development", items: ["HTML5", "CSS3", "Bootstrap", "UI/UX"] },
  { group: "Programming Languages", items: ["JavaScript (ES6+)", "TypeScript"] },
  { group: "Frameworks and Libraries", items: ["React", "Node.js", "Express"] },
  { group: "Tools and Version Control", items: ["Git", "GitHub", "VS Code", "Docker"] },
  { group: "Soft Skills", items: ["Teamwork", "Communication", "Problem Solving", "Time Management"] }
];

const EMAIL = "jeuovanygozaf@gmail.com";
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;   // textContent = safe text
  return node;
};

document.documentElement.classList.add("js");
$("#year").textContent = new Date().getFullYear();

/* ---------- Skills ---------- */
function renderSkills() {
  const grid = $("#skillsGrid");
  skills.forEach((s, i) => {
    const card = el("article", "skill-card reveal");
    card.style.setProperty("--d", `${i * 70}ms`);
    card.append(el("h3", "", s.group));
    const tags = el("ul", "tags");
    s.items.forEach(name => { const li = el("li", "tag", name); tags.append(li); });
    card.append(tags);
    grid.append(card);
  });
}

/* ---------- Projects ---------- */
function linkButton(label, url, kind, projectTitle) {
  const a = el("a", `btn btn-sm ${kind}`, label);
  a.setAttribute("aria-label", `${label}: ${projectTitle}`);
  if (url) {
    a.href = url; a.target = "_blank"; a.rel = "noopener noreferrer";
  } else {
    a.setAttribute("aria-disabled", "true");   // no href = not focusable, not clickable
    a.setAttribute("role", "link");
  }
  return a;
}

function createCard(p, index) {
  const card = el("article", "card reveal");
  card.style.setProperty("--d", `${(index % 3) * 90}ms`);

  const media = el("div", "card-media");
  const img = el("img");
  img.src = p.image; img.alt = `Screenshot of the ${p.title} project`;
  img.loading = "lazy"; img.width = 1376; img.height = 768;
  media.append(img);

  const body = el("div", "card-body");
  body.append(el("p", "card-cat", p.category), el("h3", "", p.title));
  body.append(el("p", "card-desc", p.description || "Project description coming soon. Edit it in js/script.js."));

  const tags = el("ul", "tags");
  if (p.technologies.length) p.technologies.forEach(t => tags.append(el("li", "tag", t)));
  else tags.append(el("li", "tag placeholder", "Technologies: add in script.js"));
  body.append(tags);

  const actions = el("div", "card-actions");
  actions.append(
    linkButton("View Project", p.liveUrl, "btn-primary", p.title),
    linkButton("View Code", p.githubUrl, "btn-secondary", p.title)
  );
  body.append(actions);

  const missing = [];
  if (!p.liveUrl) missing.push("Live site: this project must be deployed first.");
  if (!p.githubUrl) missing.push("Code: repository link not added yet.");
  if (missing.length) body.append(el("p", "card-note", missing.join(" ")));

  card.append(media, body);
  return card;
}

let activeCategory = "All";
function renderProjects() {
  const grid = $("#projectGrid");
  grid.replaceChildren();
  projects
    .filter(p => activeCategory === "All" || p.category === activeCategory)
    .forEach((p, i) => grid.append(createCard(p, i)));
  observeReveals();
}

function renderFilters() {
  const wrap = $("#filters");
  const categories = ["All", ...new Set(projects.map(p => p.category))];
  categories.forEach(cat => {
    const b = el("button", "filter-btn", cat);
    b.type = "button";
    b.setAttribute("aria-pressed", String(cat === activeCategory));
    b.addEventListener("click", () => {
      activeCategory = cat;
      $$(".filter-btn", wrap).forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      renderProjects();
    });
    wrap.append(b);
  });
}

/* ---------- Scroll reveal ---------- */
let revealObserver;
function observeReveals() {
  if (!("IntersectionObserver" in window)) { $$(".reveal").forEach(n => n.classList.add("visible")); return; }
  revealObserver = revealObserver || new IntersectionObserver((entries, obs) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } });
  }, { threshold: 0.12 });
  $$(".reveal:not(.visible)").forEach(n => revealObserver.observe(n));
}

/* ---------- Navigation ---------- */
const header = $("#header"), toggle = $("#navToggle"), menu = $("#navMenu");
function setMenu(open) {
  menu.classList.toggle("open", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}
toggle.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
$$(".nav-link", menu).forEach(a => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", e => { if (e.key === "Escape" && menu.classList.contains("open")) { setMenu(false); toggle.focus(); } });

const sections = $$("main section[id]");
const navLinks = $$(".nav-link");
function onScroll() {
  const y = window.scrollY;
  header.classList.toggle("scrolled", y > 10);
  $("#toTop").classList.toggle("show", y > 350);

  // Active link: the last section whose top has passed the navbar line
  const line = y + 120;
  let current = sections[0].id;
  sections.forEach(s => { if (s.offsetTop <= line) current = s.id; });
  if (window.innerHeight + y >= document.documentElement.scrollHeight - 4) current = sections[sections.length - 1].id;
  navLinks.forEach(a => {
    const on = a.getAttribute("href") === `#${current}`;
    a.classList.toggle("active", on);
    on ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current");
  });
}
let ticking = false;
window.addEventListener("scroll", () => {
  if (!ticking) { requestAnimationFrame(() => { onScroll(); ticking = false; }); ticking = true; }
}, { passive: true });

$("#toTop").addEventListener("click", () => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
});

/* ---------- Contact form ---------- */
const form = $("#contactForm"), status = $("#formStatus");
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const rules = {
  name:    v => v.trim().length >= 2 ? "" : "Enter your name (at least 2 characters).",
  email:   v => !v.trim() ? "Enter your email address." : emailPattern.test(v.trim()) ? "" : "Enter a valid email, like name@example.com.",
  subject: v => v.trim().length >= 3 ? "" : "Enter a subject (at least 3 characters).",
  message: v => v.trim().length >= 10 ? "" : "Write a message of at least 10 characters."
};
function validateField(input) {
  const msg = rules[input.name](input.value);
  const box = input.closest(".field");
  box.classList.toggle("invalid", Boolean(msg));
  $(".error", box).textContent = msg;
  input.setAttribute("aria-invalid", String(Boolean(msg)));
  return !msg;
}
$$("input, textarea", form).forEach(i => {
  i.addEventListener("blur", () => validateField(i));
  i.addEventListener("input", () => { if (i.closest(".field").classList.contains("invalid")) validateField(i); });
});
form.addEventListener("submit", e => {
  e.preventDefault();
  status.replaceChildren();
  const fields = $$("input, textarea", form);
  const results = fields.map(validateField);
  if (results.includes(false)) { fields[results.indexOf(false)].focus(); return; }

  // No backend is configured, so nothing is sent from this page.
  const data = Object.fromEntries(new FormData(form));
  const body = `${data.message}\n\nFrom: ${data.name} (${data.email})`;
  const href = `mailto:${EMAIL}?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(body)}`;
  const link = el("a", "", "Open this message in your email app");
  link.href = href;
  status.append("Your message is ready, but it has not been sent: this site has no server to deliver it. ", link, ".");
});

/* ---------- Init ---------- */
renderSkills();
renderFilters();
renderProjects();
observeReveals();
onScroll();
