<template>
  <div class="not-found-container">
    <div class="not-found">
      <h1 class="not-found-title">Error 404</h1>
      <p class="not-found-text">Oops. Page not found ¯\_(ツ)_/¯</p>
      <router-link to="/">Back to start page</router-link>
    </div>
  </div>
</template>

<style>
.not-found-container {
  font-family: 'Inconsolata', monospace;
  min-height: 100vh;
  background: white;
}

.not-found {
  display: flex;
  align-items: center;
  flex-direction: column;
}

.not-found-title {
  font-size: 60px;
  line-height: 1.1;
}

.not-found-text {
  font-size: 20px;
  white-space: nowrap;
  border-right: solid 3px black;
  overflow: hidden;
}

.not-found-text {
  animation: animated-text 4s steps(25) 1s 1 normal both, animated-cursor 600ms steps(25) infinite;
}

@keyframes animated-text {
  from {
    width: 0;
  }
  to {
    width: 340px;
  }
}

@keyframes animated-cursor {
  from {
    border-right-color: black;
  }
  to {
    border-right-color: transparent;
  }
}
</style>
