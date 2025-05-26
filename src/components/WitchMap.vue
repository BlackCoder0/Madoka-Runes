<template>
  <div class="map-layout">
    <div class="map-container">
      <img src="/map/Madoa_PSP_World_Map.jpg" alt="World Map" class="world-map" />
      <div class="points-container">
        <div
  v-for="point in points"
  :key="point.id"
  class="point-wrapper"
  :style="{ top: point.y + '%', left: point.x + '%' }"
  @mouseenter="hoveredPoint = point"
  @mouseleave="hoveredPoint = null"
  @click="showPointInfo(point)"
>
  <img v-if="point.icon" :src="point.icon" :alt="point.name" class="point-icon" />
  <div v-else class="point"></div>
  <div class="name-label">{{ point.name }}</div>

  <!-- 悬浮信息框（仅电脑端） -->
  <div v-if="hoveredPoint === point && !isMobile && (hoveredPoint.des || hoveredPoint.info)" class="hover-tooltip">
    <table>
      <tr v-if="point.des"><th>简要</th><td>{{ point.des }}</td></tr>
      <tr v-if="point.info"><th>说明</th><td v-html="formatInfo(point.info)"></td></tr>
    </table>
  </div> </div>
      </div>
    </div>

    <div v-if="selectedPoint && isMobile" class="info-panel">
  <h3>{{ selectedPoint.name }}</h3>
  <div v-if="selectedPoint.des" v-html="formatInfo(selectedPoint.des)" class="info-content"></div>
  <div v-if="selectedPoint.info" v-html="formatInfo(selectedPoint.info)" class="info-content"></div>
  <button @click="hidePointInfo" class="close-btn">关闭</button>
</div>
  </div>
</template>

<script>
export default {
  name: 'WitchMap',
  data() {
    return {
      points: [
        { id: 1, x: 20, y: 53, name: '鹿目圆家', des:'鹿目圆和家人居住的家',icon: '/map/家.png' },
        { id: 2, x: 50, y: 75, name: '见泷原中学校', des:'小圆等人就读的中学', icon: '/map/学校.png' },
        { id: 3, x: 35, y: 45, name: '见泷原入口',des:'见泷原入口，支持市民生活的交通要道',info: '◈人鱼的魔女Oktavia von Seckendorff<br>※public\\map\\Sayaka-head.png变成魔女', icon: '/map/车站.png' },
        { id: 4, x: 65, y: 63, name: '巴麻美家', des:'巴麻美居住的公寓',icon: '/map/家.png' },
        { id: 5, x: 47, y: 25, name: '见泷原市综合医院',info: '◈零食的魔女 CHARLOTTE<br>※public\\map\\Mami-head.png牺牲<br>※【天台】public\\map\\Sayaka-head.png变成魔法少女<br>【天台】上条恭介康复后第一次拉琴', icon: '/map/医院.png' },
        { id: 6, x: 30, y: 36, name: '晓美焰家',  des:'晓美焰居住的房间',icon: '/map/家.png' },
        { id: 7, x: 56, y: 46, name: '闹市',des:'聚集了学生和上班族的闹市',info: '◈玫瑰园的魔女GERTRUD<br>◈【小巷】银之魔女GISELA<br>【CD店】public\\map\\Sayaka-head.png常去的CD店<br>【游戏中心】public\\map\\Kyoko-head.png常去的跳舞机<br>【酒店】public\\map\\Kyoko-head.png居住所在', icon: '/map/闹市.png'},
        { id: 8, x: 24, y: 76, name: '美树沙耶香家', des:'美树沙耶香和家人居住的公寓', icon: '/map/家.png' },
        { id: 9, x: 94, y: 40, name: '工业地带',des:'各类工厂林立的工业地带',info: '◈影之魔女Elsa Maria<br>◈【废工厂】箱之魔女H.N. ELLY (KIRSTEN)<br>【废工厂】魔法少女public\\map\\Sayaka-head.png首战<br>【军事基地】public\\map\\Homura-head.png获取军火', icon: '/map/工厂.png' },
        { id: 10, x: 10, y: 46, name: '公园',des:'车站附近的公园，见泷原市民休息的场所',info: 'TV第三集public\\map\\Homura-head.pngpublic\\map\\Mami-head.png对持<br>仁美对上条恭介告白<br>TV第八集public\\map\\Homura-head.pngpublic\\map\\Madoka-head.png对话<br>public\\map\\Kyube-head.png被打成筛子', icon: '/map/公园.png' },
        { id: 11, x: 67, y: 31, name: '干线道路及步行天桥',info: '※众人首次得知灵魂宝石作用<br>public\\map\\Sayaka-head.png public\\map\\Kyoko-head.png战斗', icon: '/map/桥梁.png' },
        { id: 12, x: 80, y: 50, name: '展望台',des:'一览见泷原风貌的展望台',info: 'TV第五集public\\map\\Kyoko-head.png观察点', icon: '/map/瞭望台.png' },
        { id: 13, x: 33, y: 68, name: '中学的上学路',info: 'public\\map\\Madoka-head.png-仁美-public\\map\\Sayaka-head.png固定刷新点',icon: '/map/道路.png'},
        { id: 14, x: 78, y: 33, name: '河川敷',des:'沿着见泷原河河堤而筑的河川敷，附近有游乐场',info: '小说版确定为姬名河<br>TV第五集public\\map\\Madoka-head.png public\\map\\Sayaka-head.png对话', icon: '/map/风力发电站.svg'},
        { id: 15, x: 95, y: 63, name: '教会',des:'见泷原郊外的教会',info: '※public\\map\\Kyoko-head.png及其家人曾经所在的教会<br>TV第七集public\\map\\Kyoko-head.png public\\map\\Sayaka-head.png谈话', icon: '/map/教堂.svg'},
        ],
    selectedPoint: null,
    hoveredPoint: null,
    isMobile: window.innerWidth <= 700
  };
},
mounted() {
  window.addEventListener('resize', this.checkMobile);
},
beforeDestroy() {
  window.removeEventListener('resize', this.checkMobile);
},
methods: {
  showPointInfo(point) {
  if (this.isMobile) {
    this.selectedPoint = point;
  } else if (this.hasPointInfo(point)) {
    this.selectedPoint = point;
  } else {
    this.selectedPoint = null;
  }
},
    hasPointInfo(point) {
  return point && (point.des || point.info);
  },
  hidePointInfo() {
    this.selectedPoint = null;
  },
  formatInfo(info) {
    return info
      .replace(/(public[\\/]+map[\\/]+[\w\-]+\.png)/g, '<img src="/$1" alt="HEADER" style="height:2.5em;vertical-align:middle;">')
      .replace(/(◈[^<]*)/g, '<span style="color:#b85c00;font-weight:bold;">$1</span>')
      .replace(/(\*[^<]*)/g, '<span style="color:#1976d2;font-weight:bold;">$1</span>')
      .replace(/(【[^】]+】)/g, '<span style="color:#d81b60;">$1</span>');
  },
  checkMobile() {
    this.isMobile = window.innerWidth <= 700;
  }
}
};
</script>

<style scoped>
.map-layout {
  display: flex;
  flex-direction: row;
  gap: 16px;
  width: 100%;
  max-width: 100%;
  flex-wrap: wrap;
}

.map-container {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9; /* 假设地图是 16:9 比例 */
  background: #2d133b;
  border-radius: 12px;
  /* overflow: hidden; */
}
.world-map {
  width: 100%;
  height: 100%;
  object-fit: contain; /* 确保地图不裁切 */
}

.points-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* pointer-events: none; */
}

.point-wrapper {
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: pointer;
  pointer-events: auto;
  text-align: center;
}

.point-icon {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.point {
  width: 12px;
  height: 12px;
  background-color: red;
  border-radius: 50%;
}

.name-label {
  margin-top: 4px;
  font-size: 12px;
  color: #fff;
  background-color: rgba(0,0,0,0.6);
  padding: 2px 6px;
  border-radius: 4px;
  white-space: nowrap;
}

.info-panel {
  max-width: 300px;
  padding: 1rem;
  background: rgba(20, 10, 30, 0.95);
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(200, 150, 255, 0.4);
  font-size: 0.95rem;
  line-height: 1.5;
  color: #fceeff;
  backdrop-filter: blur(6px);
  transition: all 0.3s ease;
}

.info-panel h3 {
  margin-top: 0;
  font-size: 18px;
  color: #b85c00;
}

.info-content {
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
  margin-bottom: 12px;
}

.close-btn {
  padding: 6px 12px;
  background-color: #d81b60;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.close-btn:hover {
  background-color: #ad1457;
}
.hover-tooltip {
  position: absolute;
  top: 36px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(30, 10, 40, 0.95);
  color: #fceeff;
  font-size: 13px;
  padding: 8px;
  border-radius: 8px;
  white-space: normal;
  box-shadow: 0 0 8px rgba(200, 150, 255, 0.3);
  z-index: 10;
  min-width: 200px;
  max-width: 280px;
}

.hover-tooltip table {
  width: 100%;
  border-collapse: collapse;
}

.hover-tooltip th {
  text-align: left;
  font-weight: bold;
  color: #b85c00;
  padding-right: 6px;
  vertical-align: top;
  white-space: nowrap;
}

.hover-tooltip td {
  color: #fff;
  font-weight: normal;
}

@media (max-width: 700px) {
  .name-label {
    display: none;
  }
  .map-layout {
    flex-direction: column;
  }
  .map-container {
    /* height: calc(100vh - 80px); */
    margin-top: 120px;
  }
  .info-panel {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    top: 50%; 
    max-width: none;
    width: 100%;
    z-index: 999;
    border-radius: 12px 12px 0 0;
    box-shadow: 0 -4px 12px rgba(0,0,0,0.3);
    margin-top: 2%;
    margin-bottom: 20%;
  }
  .point-icon {
    width: 20px;
    height: 20px;
  }
  .map-container {
    margin-bottom: 40vh; /* 为信息面板留出空间 */
  }
}
</style>

