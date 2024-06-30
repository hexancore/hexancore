---
layout: home
pageClass: custom-homepage
hero:
  name: Hexancore
  text: Modular HexArch Framework
  tagline: 'Architectural excellence for TypeScript titans<a style="margin: 16px auto; max-width:300px; display: block" class="wip-label main-wip-label" href="/guide/what-is-hexancore">Documentation status WIP🏗️</a>'
  image:
    src: /hexancore-logo-256.png
    alt: Hexancore-Logo
  actions:
    - theme: brand
      text: What is Hexancore ?
      link: /guide/what-is-hexancore
    - theme: alt
      text: Quickstart
      link: /guide/getting-started

features:
  - icon: 📐
    title: Opinionated
    details: Designed to guide you towards the "right" way of implementing solutions with well-established practices and default configurations.
  - icon: 🛠️
    title: Modular HexArch
    details: Enhances application scalability and maintainability through clear separation of concerns.
  - icon: 💻
    title: Full-Stack Support
    details: Enables developers to write both frontend and backend in TypeScript, ensuring consistency and enhanced developer productivity across the entire stack.
  - icon: 🏛️
    title: Built on good foundations
    details: Uses NestJS for backend and Vue3 for frontend, and many more great tools.
  - icon: 🔒
    title: Comprehensive SecDevOps Integration <br>(⏳Soon...)
    details: Integrates SecDevOps practices into the development lifecycle ensuring top-notch security and compliance from start to finish.
  - icon: ✨
    title: Focused on Developer Experience(DX) <br>(⏳Soon...)
    details: Enhance your coding journey with a framework that prioritizes developer satisfaction, offering intuitive tools, seamless integration, and comprehensive documentation designed to minimize friction and maximize productivity.
---

<script setup>
import { onMounted } from 'vue';
onMounted(() => {
  const page = document.querySelector(".custom-homepage");
  //page.style.opacity = 1;

});

</script>
