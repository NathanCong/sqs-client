<template>
  <div class="common-background">
    <!-- 浮动粒子 -->
    <div class="particles">
      <div
        v-for="i in 20"
        :key="i"
        class="particle"
        :style="getParticleStyle()"
      ></div>
    </div>

    <!-- AI神经网络节点 -->
    <svg class="neural-network" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <!-- 连接线 -->
      <g class="connections">
        <line
          x1="10%"
          y1="20%"
          x2="30%"
          y2="40%"
          stroke="rgba(59, 130, 246, 0.3)"
          stroke-width="1"
        />
        <line
          x1="30%"
          y1="40%"
          x2="50%"
          y2="30%"
          stroke="rgba(59, 130, 246, 0.3)"
          stroke-width="1"
        />
        <line
          x1="50%"
          y1="30%"
          x2="70%"
          y2="50%"
          stroke="rgba(59, 130, 246, 0.3)"
          stroke-width="1"
        />
        <line
          x1="70%"
          y1="50%"
          x2="90%"
          y2="35%"
          stroke="rgba(59, 130, 246, 0.3)"
          stroke-width="1"
        />
        <line
          x1="20%"
          y1="70%"
          x2="40%"
          y2="80%"
          stroke="rgba(59, 130, 246, 0.3)"
          stroke-width="1"
        />
        <line
          x1="40%"
          y1="80%"
          x2="60%"
          y2="75%"
          stroke="rgba(59, 130, 246, 0.3)"
          stroke-width="1"
        />
        <line
          x1="60%"
          y1="75%"
          x2="80%"
          y2="85%"
          stroke="rgba(59, 130, 246, 0.3)"
          stroke-width="1"
        />
      </g>
      <!-- 节点 -->
      <g class="nodes" filter="url(#glow)">
        <circle cx="10%" cy="20%" r="4" fill="#3b82f6" class="node" />
        <circle cx="30%" cy="40%" r="4" fill="#3b82f6" class="node" />
        <circle cx="50%" cy="30%" r="4" fill="#3b82f6" class="node" />
        <circle cx="70%" cy="50%" r="4" fill="#3b82f6" class="node" />
        <circle cx="90%" cy="35%" r="4" fill="#3b82f6" class="node" />
        <circle cx="20%" cy="70%" r="4" fill="#3b82f6" class="node" />
        <circle cx="40%" cy="80%" r="4" fill="#3b82f6" class="node" />
        <circle cx="60%" cy="75%" r="4" fill="#3b82f6" class="node" />
        <circle cx="80%" cy="85%" r="4" fill="#3b82f6" class="node" />
      </g>
    </svg>

    <!-- 六边形装饰 -->
    <div class="hexagons">
      <div class="hexagon hexagon-1"></div>
      <div class="hexagon hexagon-2"></div>
      <div class="hexagon hexagon-3"></div>
    </div>

    <!-- 数据流动线条 -->
    <div class="data-streams">
      <div class="stream stream-1"></div>
      <div class="stream stream-2"></div>
      <div class="stream stream-3"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// 生成粒子样式
function getParticleStyle() {
  const size = Math.random() * 3 + 1
  const left = Math.random() * 100
  const animationDelay = Math.random() * 5
  const animationDuration = Math.random() * 10 + 10

  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${left}%`,
    animationDelay: `${animationDelay}s`,
    animationDuration: `${animationDuration}s`
  }
}
</script>

<style lang="less" scoped>
.common-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

/* 浮动粒子 */
.particles {
  position: absolute;
  width: 100%;
  height: 100%;

  .particle {
    position: absolute;
    background: var(--primary-color);
    border-radius: 50%;
    opacity: 0.6;
    animation: particleFloat linear infinite;
    box-shadow: 0 0 10px var(--primary-color);
  }
}

@keyframes particleFloat {
  0% {
    transform: translateY(100vh) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 0.6;
  }
  90% {
    opacity: 0.6;
  }
  100% {
    transform: translateY(-100px) translateX(50px);
    opacity: 0;
  }
}

/* AI神经网络 */
.neural-network {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;

  .connections line {
    stroke-dasharray: 5, 5;
    animation: dashFlow 20s linear infinite;
  }

  .nodes .node {
    animation: nodePulse 2s ease-in-out infinite;
  }
}

@keyframes dashFlow {
  to {
    stroke-dashoffset: -1000;
  }
}

@keyframes nodePulse {
  0%,
  100% {
    opacity: 0.6;
    r: 4;
  }
  50% {
    opacity: 1;
    r: 6;
  }
}

/* 六边形装饰 */
.hexagons {
  position: absolute;
  width: 100%;
  height: 100%;

  .hexagon {
    position: absolute;
    width: 100px;
    height: 100px;
    opacity: 0.1;
    animation: hexagonRotate 20s linear infinite;

    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      height: 100%;
      background: transparent;
      border: 2px solid var(--primary-color);
      clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    }
  }

  .hexagon-1 {
    top: 10%;
    right: 15%;
    animation-duration: 25s;
  }

  .hexagon-2 {
    bottom: 20%;
    left: 10%;
    animation-duration: 30s;
    animation-direction: reverse;
  }

  .hexagon-3 {
    top: 50%;
    right: 5%;
    width: 150px;
    height: 150px;
    animation-duration: 35s;
  }
}

@keyframes hexagonRotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 数据流动线条 */
.data-streams {
  position: absolute;
  width: 100%;
  height: 100%;

  .stream {
    position: absolute;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent,
      var(--primary-color),
      transparent
    );
    opacity: 0.5;
    animation: streamFlow linear infinite;
  }

  .stream-1 {
    top: 25%;
    width: 200px;
    animation-duration: 3s;
    animation-delay: 0s;
  }

  .stream-2 {
    top: 55%;
    width: 150px;
    animation-duration: 4s;
    animation-delay: 1s;
  }

  .stream-3 {
    top: 75%;
    width: 250px;
    animation-duration: 5s;
    animation-delay: 2s;
  }
}

@keyframes streamFlow {
  0% {
    left: -200px;
  }
  100% {
    left: 100%;
  }
}
</style>
