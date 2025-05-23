<template>
  <div class="map-container">
    <img src="/map/Madoa_PSP_World_Map.jpg" alt="World Map" class="world-map" />
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
  },
}
</script>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
  /* 根据图片比例设置高度，或者让高度自适应 */
  /* 例如，如果图片比例是 16:9，可以设置 padding-top: 56.25%; */
}

.world-map {
  display: block;
  width: 100%;
  height: auto;
}

.points-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* 点位容器，用于定位 */
.point-wrapper {
  position: absolute;
  cursor: pointer;
  transform: translate(-50%, -50%); /* 使点位中心对准指定位置 */
  /* 根据需要调整 wrapper 的大小，使其包含图标或圆点 */
  width: 30px; /* 调整点位容器宽度 */
  height: 30px; /* 调整点位容器高度 */
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 圆形点位的基本样式 */
.point {
  width: 15px; /* 调整圆形点位大小 */
  height: 15px; /* 调整圆形点位大小 */
  border-radius: 50%; /* 圆形点位 */
  /* background-color 将由 point.color 动态设置 */
}

/* 图标点位的样式 */
.point-icon {
  width: 100%; /* 图标大小，这里设置为100%会填充 point-wrapper */
  height: 100%; /* 图标大小，这里设置为100%会填充 point-wrapper */
  object-fit: contain; /* 保持图片比例 */
}


.point-info-box {
  position: absolute;
  /* 移除固定的 top/left 50% */
  /* top: 50%; */
  /* left: 50%; */
  transform: translate(-50%, -110%); /* 调整信息框位置，使其显示在点位上方并水平居中 */
  background-color: rgba(255, 255, 255, 0.9); /* 半透明背景 */
  color:black;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  z-index: 100; /* 确保在最上层 */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.point-info-box button {
  margin-top: 10px;
  padding: 5px 10px;
  color:pink;
  cursor: pointer;
}
</style>