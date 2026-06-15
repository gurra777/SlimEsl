const baseMonthly = 499;
const packageMonthly = 199;
const unitsPerPackage = 20;

const formatSek = (value) => new Intl.NumberFormat("sv-SE").format(value) + " kr";

const header = document.querySelector("[data-header]");
const calculator = document.querySelector("[data-calculator]");
const signupForm = document.querySelector("[data-signup-form]");

function updateHeader() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 16);
}

function updateCalculator() {
  if (!calculator) return;

  const inputs = [...calculator.querySelectorAll("input[data-weight]")];
  const totals = inputs.reduce(
    (acc, input) => {
      const count = Math.max(0, Number.parseInt(input.value, 10) || 0);
      const weight = Number.parseInt(input.dataset.weight, 10) || 1;
      acc.labels += count;
      acc.units += count * weight;
      return acc;
    },
    { labels: 0, units: 0 }
  );

  const packages = totals.units === 0 ? 0 : Math.ceil(totals.units / unitsPerPackage);
  const monthly = baseMonthly + packages * packageMonthly;

  calculator.querySelector("[data-total-labels]").textContent = totals.labels;
  calculator.querySelector("[data-total-units]").textContent = totals.units;
  calculator.querySelector("[data-packages]").textContent = packages;
  calculator.querySelector("[data-monthly]").textContent = formatSek(monthly);
}

function setupReveal() {
  const revealItems = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

if (calculator) {
  calculator.addEventListener("input", updateCalculator);
  updateCalculator();
}

if (signupForm) {
  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = signupForm.querySelector("[data-form-status]");
    if (status) {
      status.textContent = "Tack! Din intresseanmälan är redo att kopplas till ert CRM eller formulärflöde.";
    }
    signupForm.reset();
  });
}

setupReveal();
