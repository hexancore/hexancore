<script setup lang="ts">
import { withBase, useData } from 'vitepress';

const { theme } = useData();
</script>

<template>
  <div class="NotFound">
    <div class="container">
      <div class="container-content">
        <p class="code">{{ theme.notFound?.code ?? '404' }}</p>
        <h1 class="title">{{ theme.notFound?.title ?? 'PAGE NOT FOUND' }}</h1>
        <div class="divider"></div>
        <blockquote class="quote">
          {{ theme.notFound?.quote ?? "Oh no! You've been sucked into a black hole." }}
        </blockquote>
        <div class="action">
          <a class="link" href="/" :aria-label="theme.notFound?.linkLabel ?? 'go to home'">
            {{ theme.notFound?.linkText ?? 'Beam me up, Scotty!' }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.NotFound {
  color: white !important;
  background-image: url('/assets/404-blackhole.webp');
  background-color: black;
  background-size: cover;
  background-position: 100% 90%;
  background-repeat: no-repeat;
  height: 100vh;
  text-align: center;
}

.NotFound > .container {
  margin-bottom: 36vh;
}

.NotFound > .container > .container-content {
  backdrop-filter: blur(16px) contrast(20%) saturate(16) opacity(0.8);
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 16px;
  border: 1px;
  padding-top: 1em;
  padding-bottom: 1em;
  width: 40%;

  margin: auto;
}

@media (min-width: 768px) {
  .NotFound {
    padding: 36px 32px 168px;
  }
}

.code {
  line-height: 64px;
  font-size: 64px;
  font-weight: 600;
}

.title {
  padding-top: 12px;
  letter-spacing: 2px;
  line-height: 20px;
  font-size: 20px;
  font-weight: 700;
}

.divider {
  margin: 24px auto 18px;
  width: 64px;
  height: 1px;
  background-color: var(--vp-c-divider);
}

.quote {
  margin: 0 auto;
  max-width: 256px;
  font-size: 14px;
  font-weight: 500;
  color: #fff200;
}

.action {
  padding-top: 20px;
}

.link {
  display: inline-block;
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 16px;
  padding: 3px 16px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-brand-1);
  transition: border-color 0.25s, color 0.25s;
}

.link:hover {
  border-color: var(--vp-c-brand-2);
  color: var(--vp-c-brand-2);
}
</style>
