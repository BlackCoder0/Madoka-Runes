<template>
  <div class="map-container">
    <img src="/map/Madoa_PSP_World_Map.jpg" alt="World Map" class="world-map" />

    <!-- Embedded SVG for the path -->
    <svg class="embedded-svg" viewBox="0 0 1440 900" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <g id="path-group" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <polyline ref="pathElement" id="path" points="130.896846 440.973055 77.5736485 440.973055 37.1505202 369.443329 37.1505202 356.479448 51.9044918 351.186423 224.12596 351.186423 231.548286 330.534893 224.12596 255.156304 231.548286 207.572814 384.619482 213.802866 484.122309 199.455275 653.112882 162.545157 670.983559 247.421636 670.983559 364.482797 638.20106 369.443329 631.544477 406.417259 608.545342 415.874847 608.545342 467.454973 622.076813 475.219868 670.983559 467.454973 670.983559 429.285411" stroke="#FFFFFF" stroke-opacity="0"></polyline>
      </g>
    </svg>

    <!-- Container for footprints -->
    <div ref="trackElement" class="track-container">
      <!-- 响应式脚印渲染 -->
      <div v-for="(fp, idx) in footprints" :key="idx" class="footprint"
        :class="[{ last: fp.last }, { faded: fp.faded }]"
        :style="{
          left: fp.left + 'px',
          top: fp.top + 'px',
          position: 'absolute',
          transform: 'translate(-50%, -50%) rotate(' + (fp.angle || 0) + 'rad)'
        }">
        <div class="foot left" :style="{ animationDelay: (fp.isRight ? '1s' : '0s') }"></div>
        <div class="foot right" :style="{ animationDelay: (fp.isRight ? '0s' : '1s') }"></div>
        <div v-if="!fp.faded" class="name-label" :style="{ left: '50%', top: '-30px', position: 'absolute', transform: 'translate(-50%, 0)', background: 'rgba(0,0,0,0.7)', color: '#fff', padding: '2px 8px', borderRadius: '5px', fontSize: '12px', whiteSpace: 'nowrap', zIndex: 10 }">{{ characterName }}</div>
      </div>
    </div>

    <!-- Element for character name -->
    <div ref="nameElement" class="name-label" style="display: none;">角色</div>

    <div class="points-container">
      <!-- 点位将在这里添加 -->
      <div
        v-for="point in points"
        :key="point.id"
        class="point-wrapper"
        :style="{ top: point.y + '%', left: point.x + '%' }"
        @click="showPointInfo(point)"
      >
        <!-- 根据点位数据渲染图标或颜色 -->
        <img v-if="point.icon" :src="point.icon" :alt="point.info" class="point-icon" />
        <div v-else class="point" :style="{ backgroundColor: point.color || 'red' }"></div>
      </div>
    </div>
    <!-- 点位信息显示区域 -->
    <div
      v-if="selectedPointInfo"
      class="point-info-box"
      :style="{ top: selectedPointY + '%', left: selectedPointX + '%' }"
    >
      <p>{{ selectedPointInfo }}</p>
      <button @click="hidePointInfo">关闭</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WitchMap',
  data() {
    return {
      points: [
        // 示例点位数据，请根据实际地图和需求修改
        // 可以添加 icon 属性指定图标路径 (相对于 public 目录)
        // 或者添加 color 属性指定颜色
        { id: 1, x: 20, y: 53, info: '鹿目圆家', icon: '/map/家.png' },
        { id: 2, x: 50, y: 75, info: '见泷原中学校', icon: '/map/学校.png' },
        { id: 3, x: 35, y: 45, info: '见泷原入口，支持市民生活的交通要道', icon: '/map/车站.png' },
        { id: 4, x: 65, y: 63, info: '巴麻美家', icon: '/map/家.png' },
        { id: 5, x: 47, y: 25, info: '见泷原市综合医院', icon: '/map/医院.png' },
        { id: 6, x: 30, y: 36, info: '晓美焰家', icon: '/map/家.png' },
        { id: 7, x: 56, y: 46, info: '聚集了学生和上班族的闹市', icon: '/map/闹市.png'},
        { id: 8, x: 24, y: 76, info: '美树沙耶香家', icon: '/map/家.png' },
        { id: 9, x: 94, y: 40, info: '各类工厂林立的工业地带', icon: '/map/工厂.png' },
        { id: 10, x: 10, y: 46, info: '车站附近的公园，见泷原市民休息的场时', icon: '/map/公园.png' },
        { id: 11, x: 67, y: 31, info: '干线道路及步行天桥', icon: '/map/桥梁.png' },
        { id: 12, x: 80, y: 50, info: '一览见泷原风貌的展望台', icon: '/map/瞭望台.png' },
        { id: 13, x: 33, y: 68, info: '中学的上学路', icon: '/map/道路.png'},
        { id: 14, x: 78, y: 33, info: '沿着见泷原河河堤而筑的河川敷，附近有游乐场', icon: '/map/风力发电站.svg'},
        { id: 15, x: 95, y: 63, info: '见泷原郊外的教会', icon: '/map/教堂.svg'},
      ],
      selectedPointInfo: null,
      selectedPointX: 0, // 添加存储选中点位X坐标
      selectedPointY: 0, // 添加存储选中点位Y坐标
      // Footprint animation data
      tempLen: 0,
      pathLen: 0,
      intervalId: null,
      footprintStep: 40, // Distance between footprints
      footprintSpeed: 1, // How much tempLen increases each interval
      footprintIntervalMs: 50, // Interval speed in ms
      footprintLifetimeMs: 15000, // How long a footprint stays visible
      // 新增响应式脚印数组
      footprints: [
        { left: 50, top: 50 },
        { left: 85, top: 50 },
        { left: 120, top: 50 }
      ]
    };
  },
  methods: {
    showPointInfo(point) { // 修改方法，接收整个点位对象
      this.selectedPointInfo = point.info;
      this.selectedPointX = point.x; // 存储点位X坐标
      this.selectedPointY = point.y; // 存储点位Y坐标
    },
    hidePointInfo() {
      this.selectedPointInfo = null;
    },

    // Footprint methods
    createFootprintElement() {
      const footprint = document.createElement('div');
      footprint.className = 'footprint';
      // Vite 静态资源建议放在 public 目录下，路径应为 /map/footprints.png
      // footprint.style.backgroundImage = "url('/map/footprints.png')"; // Temporarily remove to isolate background color issue
      // --- BEGIN DEBUG STYLE --- 
      footprint.style.backgroundColor = 'rgba(255, 0, 0, 0.8)'; // Bright red, slightly more opaque
      footprint.style.width = '25px'; // Explicit width, slightly larger
      footprint.style.height = '25px'; // Explicit height, slightly larger
      footprint.style.border = '3px solid yellow'; // Bright yellow border, thicker
      footprint.style.zIndex = '99999'; // Ensure it's on top, even higher
      footprint.style.position = 'absolute'; // Ensure position is absolute
      footprint.style.display = 'block !important'; // Force display
      footprint.style.visibility = 'visible !important'; // Force visibility
      // --- END DEBUG STYLE --- 
      return footprint;
    },

    getAngle(p0, p1) {
      const deltaX = p1.x - p0.x;
      const deltaY = p1.y - p0.y;
      return Math.atan2(deltaY, deltaX);
    },

    drawFootprint() {
      const path = this.$refs.pathElement;
      const track = this.$refs.trackElement;
      const nameLabel = this.$refs.nameElement;

      if (!path || !track || !nameLabel) {
        console.warn('Path, track, or nameLabel refs not found');
        return;
      }

      const point = path.getPointAtLength(this.tempLen);
      console.log(`Current path length (tempLen): ${this.tempLen}, Point: x=${point.x}, y=${point.y}`);
      
      nameLabel.style.left = `${point.x}px`;
      nameLabel.style.top = `${point.y - 30}px`;

      if (this.tempLen % this.footprintStep === 0) {
        const footprintElement = this.createFootprintElement();
        footprintElement.style.left = `${point.x}px`;
        footprintElement.style.top = `${point.y}px`;

        const prevLen = Math.max(0, this.tempLen - this.footprintStep / 2);
        const nextLen = Math.min(this.pathLen, this.tempLen + this.footprintStep / 2);
        
        const prePoint = path.getPointAtLength(prevLen);
        const nextPoint = path.getPointAtLength(nextLen);
        
        let angle = 0;
        if (this.tempLen === 0 && nextLen > 0) {
            angle = this.getAngle(point, nextPoint);
        } else if (this.tempLen > 0 && this.tempLen < this.pathLen) {
            angle = this.getAngle(prePoint, nextPoint);
        } else if (this.tempLen >= this.pathLen && prevLen < this.pathLen) {
            angle = this.getAngle(prePoint, point);
        }
        
        footprintElement.style.transform = `translate(-50%, -50%) rotate(${angle + Math.PI / 2}rad)`;
        console.log('Appending footprint:', footprintElement, `left: ${footprintElement.style.left}`, `top: ${footprintElement.style.top}`, `transform: ${footprintElement.style.transform}`);

        track.appendChild(footprintElement);

        if (this.tempLen > this.pathLen) {
          clearInterval(this.intervalId);
          this.intervalId = null;
          footprintElement.classList.add('last');
        } else {
          setTimeout(() => {
            if (footprintElement.parentElement) {
                footprintElement.remove();
            }
          }, this.footprintLifetimeMs);
        }
      }
      this.tempLen += this.footprintSpeed;
      if (this.tempLen > this.pathLen + this.footprintStep) {
          clearInterval(this.intervalId);
          this.intervalId = null;
      }
    },

    startFootprintAnimation() {
      // 初始化路径长度和动画参数
      const path = this.$refs.pathElement;
      if (!path) {
        console.warn('SVG 路径未找到');
        return;
      }
      this.pathLen = path.getTotalLength();
      this.tempLen = 0;
      this.footprints = [];
      this.characterName = '鹿目圆'; // 可根据实际角色动态赋值
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }
      this.intervalId = setInterval(() => {
        if (this.tempLen > this.pathLen + this.footprintStep) {
          clearInterval(this.intervalId);
          this.intervalId = null;
          return;
        }
        const point = path.getPointAtLength(this.tempLen);
        // 计算旋转角度
        const prevLen = Math.max(0, this.tempLen - this.footprintStep / 2);
        const nextLen = Math.min(this.pathLen, this.tempLen + this.footprintStep / 2);
        const prePoint = path.getPointAtLength(prevLen);
        const nextPoint = path.getPointAtLength(nextLen);
        let angle = 0;
        if (this.tempLen === 0 && nextLen > 0) {
          angle = this.getAngle(point, nextPoint);
        } else if (this.tempLen > 0 && this.tempLen < this.pathLen) {
          angle = this.getAngle(prePoint, nextPoint);
        } else if (this.tempLen >= this.pathLen && prevLen < this.pathLen) {
          angle = this.getAngle(prePoint, point);
        }
        // 每隔 footprintStep 添加一个脚印
           if (this.tempLen % this.footprintStep === 0) {
             // 先将所有已有脚印标记为旧脚印
             this.footprints.forEach(fp => fp.faded = true);
             const footprint = {
               left: point.x,
               top: point.y,
               angle: angle + Math.PI / 2,
               img: "/map/footprints.png",
               faded: false
             };
             this.footprints.push(footprint);
           }
        this.tempLen += this.footprintSpeed;
      }, this.footprintIntervalMs);
    },
  },
  mounted() {
    // Ensure the DOM is fully ready, especially for $refs and SVG elements
    this.$nextTick(() => {
        this.startFootprintAnimation();
    });
  },
  beforeUnmount() { // Vue 3 uses beforeUnmount, Vue 2 uses beforeDestroy
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  },
}
</script>

<style scoped>
/* General container styling */
.map-container {
  position: relative;
  width: 100%;
  min-height: 500px;
  overflow: hidden;
}

.world-map {
  display: block; /* Remove extra space below img */
  width: 100%;
  height: 100%;
  object-fit: cover; /* Cover the container, might crop */
}

/* SVG path styling */
.embedded-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* Allow clicks to pass through to map elements */
  z-index: 1; /* Ensure SVG is above the map image but below footprints if needed */
}

/* Footprint container styling */
.track-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
}

/* Individual footprint styling */
.footprint {
  position: absolute;
  pointer-events: none;
}
.footprint .foot {
    position: absolute;
    width: 10px;
    height: 22px;
    background-image: url('/map/footprints.png');
    background-size: 40px;
    background-repeat: no-repeat;
    background-position-x: 10px;
    animation: 0.4s linear 0s footsteps forwards;
    border: none;
    background-color: transparent;
    opacity: 1;
    transition: opacity 0.2s;
  }
  .footprint.faded .foot {
    opacity: 0.6;
  }
.footprint .foot::after {
  display: none;
}
.footprint .foot.right::after {
  background-position-x: -10px;
}
@keyframes footsteps {
  0% { background-position-x: 0px; }
  25% { background-position-x: 0px; }
  25.1% { background-position-x: -10px; }
  50% { background-position-x: -10px; }
  50.1% { background-position-x: -20px; }
  75% { background-position-x: -20px; }
  75.1% { background-position-x: -30px; }
  100% { background-position-x: -30px; }
}
.footprint .foot.left {
  left: -5px;
  top: 7px;
}
.footprint .foot.right {
  left: 5px;
  top: -7px;
  background-position-y: -22px;
  animation-delay: 1s;
}


/* Name label styling */
.name-label {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 12px;
  white-space: nowrap;
  transform: translate(-50%, -150%); /* Position above the current point */
  z-index: 3; /* Ensure name label is on top */
}

/* Points container styling */
.points-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* Container itself doesn't block clicks */
  z-index: 0; /* Behind SVG and footprints, but above map image if map is z-index -1 */
}

.point-wrapper {
  position: absolute;
  transform: translate(-50%, -50%); /* Center the point/icon */
  cursor: pointer;
  pointer-events: auto; /* Individual points are clickable */
}

.point {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.point-icon {
  width: 30px; /* Adjust as needed */
  height: 30px; /* Adjust as needed */
  object-fit: contain;
}

/* Point info box styling */
.point-info-box {
  position: absolute;
  transform: translate(-50%, -110%); /* Position above the point */
  background-color: white;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  z-index: 10; /* Ensure it's above other elements */
  pointer-events: auto; /* Allow interaction with the info box */
}

.point-info-box p {
  margin: 0 0 10px 0;
  color:black;
}

.point-info-box button {
  padding: 5px 10px;
  background-color: pink;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.point-info-box button:hover {
  background-color: #0056b3;
}
</style>