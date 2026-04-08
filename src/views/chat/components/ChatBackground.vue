<template>
  <div class="chat-background">
    <!-- 电路板纹路 -->
    <svg class="circuit-pattern" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern
          id="circuit"
          x="0"
          y="0"
          width="200"
          height="200"
          patternUnits="userSpaceOnUse"
        >
          <!-- 横线 -->
          <line
            x1="0"
            y1="50"
            x2="50"
            y2="50"
            stroke="rgba(59, 130, 246, 0.15)"
            stroke-width="1"
          />
          <line
            x1="150"
            y1="50"
            x2="200"
            y2="50"
            stroke="rgba(59, 130, 246, 0.15)"
            stroke-width="1"
          />
          <line
            x1="0"
            y1="150"
            x2="75"
            y2="150"
            stroke="rgba(59, 130, 246, 0.15)"
            stroke-width="1"
          />
          <!-- 竖线 -->
          <line
            x1="50"
            y1="0"
            x2="50"
            y2="50"
            stroke="rgba(59, 130, 246, 0.15)"
            stroke-width="1"
          />
          <line
            x1="150"
            y1="50"
            x2="150"
            y2="150"
            stroke="rgba(59, 130, 246, 0.15)"
            stroke-width="1"
          />
          <line
            x1="75"
            y1="150"
            x2="75"
            y2="200"
            stroke="rgba(59, 130, 246, 0.15)"
            stroke-width="1"
          />
          <!-- 节点 -->
          <circle cx="50" cy="50" r="2" fill="rgba(59, 130, 246, 0.3)" />
          <circle cx="150" cy="50" r="2" fill="rgba(59, 130, 246, 0.3)" />
          <circle cx="150" cy="150" r="2" fill="rgba(59, 130, 246, 0.3)" />
          <circle cx="75" cy="150" r="2" fill="rgba(59, 130, 246, 0.3)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#circuit)" />
    </svg>

    <!-- 扫描线 -->
    <div class="scan-line"></div>

    <!-- HUD角落装饰 -->
    <div class="hud-corners">
      <div class="corner corner-tl"></div>
      <div class="corner corner-tr"></div>
      <div class="corner corner-bl"></div>
      <div class="corner corner-br"></div>
    </div>

    <!-- 二进制代码流 -->
    <div class="binary-streams">
      <div
        class="binary-column"
        v-for="i in 8"
        :key="i"
        :style="getBinaryStyle(i)"
      >
        <span v-for="j in 15" :key="j">{{
          Math.random() > 0.5 ? '1' : '0'
        }}</span>
      </div>
    </div>

    <!-- 能量脉冲环 -->
    <div class="pulse-rings">
      <div class="pulse-ring pulse-ring-1"></div>
      <div class="pulse-ring pulse-ring-2"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// 生成二进制代码流样式
function getBinaryStyle(index: number) {
  const left = (index / 8) * 100
  const animationDelay = Math.random() * 5
  const animationDuration = Math.random() * 10 + 15

  return {
    left: `${left}%`,
    animationDelay: `${animationDelay}s`,
    animationDuration: `${animationDuration}s`
  }
}
</script>

<style lang="less" scoped>
/* 科技背景装饰层 */
.chat-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

/* 电路板纹路 */
.circuit-pattern {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0.4;
}

/* 扫描线效果 */
.scan-line {
  position: absolute;
  width: 100%;
  height: 3px;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(59, 130, 246, 0.6),
    transparent
  );
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
  animation: scanLineMove 8s linear infinite;
}

@keyframes scanLineMove {
  0% {
    top: -10px;
    opacity: 0;
  }
  5% {
    opacity: 1;
  }
  95% {
    opacity: 1;
  }
  100% {
    top: 100%;
    opacity: 0;
  }
}

/* HUD角落装饰 */
.hud-corners {
  position: absolute;
  width: 100%;
  height: 100%;

  .corner {
    position: absolute;
    width: 60px;
    height: 60px;
    border: 2px solid rgba(59, 130, 246, 0.4);

    &::before,
    &::after {
      content: '';
      position: absolute;
      background: rgba(59, 130, 246, 0.6);
    }

    &::before {
      width: 15px;
      height: 2px;
    }

    &::after {
      width: 2px;
      height: 15px;
    }
  }

  .corner-tl {
    top: 20px;
    left: 20px;
    border-right: none;
    border-bottom: none;
    animation: hudGlow 3s ease-in-out infinite;

    &::before {
      top: -2px;
      left: -2px;
    }

    &::after {
      top: -2px;
      left: -2px;
    }
  }

  .corner-tr {
    top: 20px;
    right: 20px;
    border-left: none;
    border-bottom: none;
    animation: hudGlow 3s ease-in-out infinite 0.5s;

    &::before {
      top: -2px;
      right: -2px;
    }

    &::after {
      top: -2px;
      right: -2px;
    }
  }

  .corner-bl {
    bottom: 20px;
    left: 20px;
    border-right: none;
    border-top: none;
    animation: hudGlow 3s ease-in-out infinite 1s;

    &::before {
      bottom: -2px;
      left: -2px;
    }

    &::after {
      bottom: -2px;
      left: -2px;
    }
  }

  .corner-br {
    bottom: 20px;
    right: 20px;
    border-left: none;
    border-top: none;
    animation: hudGlow 3s ease-in-out infinite 1.5s;

    &::before {
      bottom: -2px;
      right: -2px;
    }

    &::after {
      bottom: -2px;
      right: -2px;
    }
  }
}

@keyframes hudGlow {
  0%,
  100% {
    opacity: 0.4;
    box-shadow: 0 0 5px rgba(59, 130, 246, 0.2);
  }
  50% {
    opacity: 1;
    box-shadow: 0 0 15px rgba(59, 130, 246, 0.6);
  }
}

/* 二进制代码流 */
.binary-streams {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .binary-column {
    position: absolute;
    top: -100%;
    display: flex;
    flex-direction: column;
    font-family: 'Courier New', monospace;
    font-size: 12px;
    color: rgba(59, 130, 246, 0.3);
    line-height: 1.5;
    animation: binaryFall linear infinite;

    span {
      opacity: 0;
      animation: binaryFade 2s ease-in-out infinite;

      &:nth-child(odd) {
        animation-delay: 0.5s;
      }
    }
  }
}

@keyframes binaryFall {
  0% {
    top: -100%;
  }
  100% {
    top: 100%;
  }
}

@keyframes binaryFade {
  0%,
  100% {
    opacity: 0;
  }
  50% {
    opacity: 0.6;
  }
}

/* 能量脉冲环 */
.pulse-rings {
  position: absolute;
  width: 100%;
  height: 100%;

  .pulse-ring {
    position: absolute;
    border: 2px solid rgba(59, 130, 246, 0.4);
    border-radius: 50%;
    animation: pulseExpand 4s ease-out infinite;
  }

  .pulse-ring-1 {
    top: 30%;
    left: 15%;
    width: 80px;
    height: 80px;
    animation-delay: 0s;
  }

  .pulse-ring-2 {
    bottom: 25%;
    right: 20%;
    width: 120px;
    height: 120px;
    animation-delay: 2s;
  }
}

@keyframes pulseExpand {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  50% {
    opacity: 0.6;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}
</style>
