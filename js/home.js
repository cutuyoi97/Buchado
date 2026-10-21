import { createCountdown } from "./utils/countdown.js";
import { observeReveal } from "./utils/reveal.js";

document.querySelectorAll("[data-start]").forEach((card) => createCountdown(card));

observeReveal(".community-gallery-item");
observeReveal(".news-card", { stagger: 0.08 });
