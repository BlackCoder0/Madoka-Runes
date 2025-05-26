<template>
  <div class="map-layout">
    <div class="map-container" ref="mapContainer">

      <img src="/map/Madoa_PSP_World_Map.jpg" alt="World Map" class="world-map" />
      <canvas ref="canvas" class="map-canvas"></canvas>

      <div class="points-container">
        <div v-for="point in points" :key="point.id" class="point-wrapper"
          :style="{ top: point.y + '%', left: point.x + '%' }" @mouseenter="hoveredPoint = point"
          @mouseleave="hoveredPoint = null" @click="showPointInfo(point)">
          <img v-if="point.icon" :src="point.icon" :alt="point.name" class="point-icon" />
          <div v-else class="point"></div>
          <div class="name-label">{{ point.name }}</div>

          <div v-if="hoveredPoint === point && !isMobile && (hoveredPoint.des || hoveredPoint.info)"
            class="hover-tooltip">
            <table>
              <tr v-if="point.des">
                <th>简要</th>
                <td>{{ point.des }}</td>
              </tr>
              <tr v-if="point.info">
                <th>说明</th>
                <td v-html="formatInfo(point.info)"></td>
              </tr>
            </table>
          </div>
        </div>

        <!-- 路径上的角色名牌 -->
        <div v-for="tag in visiblePathTags" :key="tag.key" class="path-tag"
          :style="{ top: tag.top + '%', left: tag.left + '%', transform: 'translate(-50%, -50%)', backgroundColor: tag.color + 'cc' }">
          {{ tag.name }}
        </div>
      </div>
    </div>

    <div v-if="selectedPoint && isMobile" class="info-panel">
      <h3>{{ selectedPoint.name }}</h3>
      <div v-if="selectedPoint.des" v-html="formatInfo(selectedPoint.des)" class="info-content"></div>
      <div v-if="selectedPoint.info" v-html="formatInfo(selectedPoint.info)" class="info-content"></div>
      <button @click="hidePointInfo" class="close-btn">关闭</button>
    </div>

    <div class="episode-selector" style="display: flex; align-items: center; gap: 10px;">
      <label>选择集数：</label>
      <select v-model="currentEpisode" @change="changeEpisode">
        <option :value="0">请选择集数</option>
        <option v-for="ep in episodes.filter(e => e !== 0)" :key="ep" :value="ep">第{{ ep }}集</option>
      </select>
      <button v-if="currentEpisode !== 0" @click="replayAnimation" class="replay-btn">重播</button>
    </div>
  </div>

</template>

<script>
  export default {
    name: 'WitchMap',
    data() {
      return {
        points: [
          { id: 1, x: 20, y: 53, name: '鹿目圆家', des: '鹿目圆和家人居住的家', icon: '/map/家.png' },
          { id: 2, x: 49, y: 75, name: '见泷原中学校', des: '小圆等人就读的中学', icon: '/map/学校.png' },
          { id: 3, x: 35, y: 45, name: '见泷原入口', des: '见泷原入口，支持市民生活的交通要道', info: '◈人鱼的魔女Oktavia von Seckendorff<br>※public\\map\\Sayaka-head.png变成魔女', icon: '/map/车站.png' },
          { id: 4, x: 65, y: 63, name: '巴麻美家', des: '巴麻美居住的公寓', icon: '/map/家.png' },
          { id: 5, x: 45, y: 25, name: '见泷原市综合医院', info: '◈零食的魔女 CHARLOTTE<br>※public\\map\\Mami-head.png牺牲<br>※【天台】public\\map\\Sayaka-head.png变成魔法少女<br>【天台】上条恭介康复后第一次拉琴', icon: '/map/医院.png' },
          { id: 6, x: 30, y: 36, name: '晓美焰家', des: '晓美焰居住的房间', icon: '/map/家.png' },
          { id: 7, x: 56, y: 46, name: '闹市', des: '聚集了学生和上班族的闹市', info: '◈玫瑰园的魔女GERTRUD<br>◈【小巷】银之魔女GISELA<br>【CD店】public\\map\\Sayaka-head.png常去的CD店<br>【游戏中心】public\\map\\Kyoko-head.png常去的跳舞机<br>【酒店】public\\map\\Kyoko-head.png居住所在', icon: '/map/闹市.png' },
          { id: 8, x: 24, y: 76, name: '美树沙耶香家', des: '美树沙耶香和家人居住的公寓', icon: '/map/家.png' },
          { id: 9, x: 94, y: 40, name: '工业地带', des: '各类工厂林立的工业地带', info: '◈影之魔女Elsa Maria<br>◈【废工厂】箱之魔女H.N. ELLY (KIRSTEN)<br>【废工厂】魔法少女public\\map\\Sayaka-head.png首战<br>【军事基地】public\\map\\Homura-head.png获取军火', icon: '/map/工厂.png' },
          { id: 10, x: 10, y: 46, name: '公园', des: '车站附近的公园，见泷原市民休息的场所', info: 'TV第三集public\\map\\Homura-head.pngpublic\\map\\Mami-head.png对持<br>仁美对上条恭介告白<br>TV第八集public\\map\\Homura-head.pngpublic\\map\\Madoka-head.png对话<br>public\\map\\Kyube-head.png被打成筛子', icon: '/map/公园.png' },
          { id: 11, x: 67, y: 31, name: '干线道路及步行天桥', info: '※众人首次得知灵魂宝石作用<br>public\\map\\Sayaka-head.png public\\map\\Kyoko-head.png战斗', icon: '/map/桥梁.png' },
          { id: 12, x: 80, y: 50, name: '展望台', des: '一览见泷原风貌的展望台', info: 'TV第五集public\\map\\Kyoko-head.png观察点', icon: '/map/瞭望台.png' },
          { id: 13, x: 33, y: 68, name: '中学的上学路', info: 'public\\map\\Madoka-head.png-仁美-public\\map\\Sayaka-head.png固定刷新点', icon: '/map/道路.png' },
          { id: 14, x: 80, y: 33, name: '河川敷', des: '沿着见泷原河河堤而筑的河川敷，附近有游乐场', info: '小说版确定为姬名河<br>TV第五集public\\map\\Madoka-head.png public\\map\\Sayaka-head.png对话', icon: '/map/风力发电站.svg' },
          { id: 15, x: 95, y: 63, name: '教会', des: '见泷原郊外的教会', info: '※public\\map\\Kyoko-head.png及其家人曾经所在的教会<br>TV第七集public\\map\\Kyoko-head.png public\\map\\Sayaka-head.png谈话', icon: '/map/教堂.svg' },
        ],
        // 模拟动画集数，有多条路径，每条路径是点位id的数组
        episodes: [0, 1, 4, 5, 6, 7],
        currentEpisode: 0,
        pathsByEpisode: {
          1: [
            {
              id: "path1",
              points: [1, 13, 2, 7, 4], // 点位id顺序
              tags: [
                { name: "鹿目圆", position: 0.1 }, // 0.3表示路径中点的30%位置
                { name: "鹿目圆/沙耶香/仁美", position: 0.3 },
                { name: "鹿目圆/沙耶香", position: 0.6 },
                { name: "鹿目圆/沙耶香/巴麻美", position: 0.9 },
              ],
              color: '#ff99cc' // 添加路径颜色
            },
            {
              id: "path2",
              points: [6, 2, 7],
              tags: [{ name: "晓美焰", position: 0.3 }],
              color: '#935ba5' // 添加路径颜色
            },
          ],
          4: [
            {
              id: "path3",
              points: [1, 13, 2, 4, 7, 9],
              tags: [
                { name: "鹿目圆", position: 0.05 },
                { name: "鹿目圆/沙耶香/仁美", position: 0.2 },
                { name: "鹿目圆/沙耶香", position: 0.55 },
                { name: "鹿目圆/仁美", position: 0.8 },
              ],
              color: '#ff99cc' // 添加路径颜色
            },
            {
              id: "path4",
              points: [8, 5, 13, 2, 5, 9],
              tags: [
                { name: "沙耶香", position: 0.1 },
                { name: "魔法少女沙耶香", position: 0.8 },
              ],
              color: '#0059d6' // 添加路径颜色
            },
          ],
          5: [
            {
              id: "path5",
              points: [2, 14, 7, 8, 7],
              tags: [
                { name: "圆/沙/仁", position: 0.1 },
                { name: "圆/沙", position: 0.3 },
                { name: "圆/焰", position: 0.6 },
                { name: "圆/沙", position: 0.6 },
              ],
              color: '#ff99cc' // 添加路径颜色
            },
            {
              id: "path6",
              points: [14, 5, 8, 7],
              tags: [
                { name: "沙耶香", position: 0.1 },
              ],
              color: '#0059d6' // 添加路径颜色
            },
            {
              id: "path7",
              points: [12, 7],
              tags: [
                { name: "杏子", position: 0.1 },
              ],
              color: '#E60000' // 添加路径颜色
            },
          ],
          6: [
            {
              id: "path8",
              points: [7, 8, 7, 5, 11],
              tags: [
                { name: "沙耶香", position: 0.1 },
                { name: "沙/圆", position: 0.3 },
                { name: "沙/杏", position: 0.85 },
              ],
              color: '#0059d6' // 添加路径颜色
            },
            // {
            //   id: "path9",
            //   points: [7,5,11],
            //   tags: [
            //     { name: "杏子", position: 0.1}, 
            //     { name: "杏/沙", position: 0.75}, 
            //   ],
            //   color: '#E60000' // 添加路径颜色
            // },
          ],
          7: [
            {
              id: "path7",
              points: [8, 15, 8, 13, 2, 7, 8, 9],
              tags: [
                { name: "沙耶香", position: 0.1 },
                { name: "沙/杏", position: 0.3 },
                { name: "沙/仁/圆", position: 0.5 },
                { name: "沙/仁", position: 0.6 },
                { name: "沙/圆", position: 0.7 },
              ],
              color: '#0059d6' // 添加路径颜色
            },
            {
              id: "path8",
              points: [7, 8, 15, 9],
              tags: [
                { name: "杏子", position: 0.1 },
                { name: "杏/沙", position: 0.5 },
                { name: "杏/焰", position: 0.95 },
              ],
              color: '#E60000' // 添加路径颜色
            },
          ],
          8: [

          ],
        },
        hoveredPoint: null,
        selectedPoint: null,
        isMobile: window.innerWidth <= 700,
        canvasContext: null,
        animationFrameId: null,
        animationProgress: 0,
        animationDuration: 4000,
      };
    },
    computed: {
      visiblePaths() {
        return this.pathsByEpisode[this.currentEpisode] || [];
      },
      // 计算当前显示路径上的名牌位置信息
      visiblePathTags() {
        if (!this.visiblePaths.length) return [];
        const result = [];
        this.visiblePaths.forEach((path) => {
          const pointCoords = path.points.map((pid) => {
            const pt = this.points.find((p) => p.id === pid);
            return pt ? { x: pt.x, y: pt.y } : null;
          }).filter(Boolean);

          const container = this.$refs.mapContainer;
          if (!container) return [];
          const width = container.clientWidth;
          const height = container.clientHeight;
          const pixelCoords = pointCoords.map(p => ({ x: (p.x / 100) * width, y: (p.y / 100) * height }));

          path.tags.forEach((tag, tagIndex) => { // Add tagIndex here
            const pos = tag.position; // 0~1
            // Calculate tag position based on the full pixel path
            const { x, y } = this.getPointOnPath(pixelCoords, pos);
            // Convert pixel coordinates back to percentage for tag style
            result.push({
              key: 'path-' + path.id + '-tag-' + tagIndex, // Add unique key
              name: tag.name,
              left: (x / width) * 100,
              top: (y / height) * 100,
              color: path.color
            });
          });
        });
        return result;
      },
    },
    mounted() {
      this.checkMobile();
      window.addEventListener("resize", this.onResize);

      // 确保地图图片加载完成后再初始化
      const mapImage = new Image();
      mapImage.src = "/map/Madoa_PSP_World_Map.jpg";
      mapImage.onload = () => {
        this.$nextTick(() => {
          this.resizeCanvas();
          this.animationProgress = 0; // 从初始状态开始
          this.drawAnimatedPaths();
        });
      };
    },
    beforeDestroy() {
      window.removeEventListener("resize", this.onResize);
      if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    },
    methods: {
      onResize() {
        this.checkMobile();
        this.resizeCanvas();
        this.drawAnimatedPaths();
      },
      resizeCanvas() {
        const canvas = this.$refs.canvas;
        const container = this.$refs.mapContainer;
        if (!container) return;

        const dpr = window.devicePixelRatio || 1;
        const rect = container.getBoundingClientRect();

        // 设置实际像素尺寸
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        // 设置显示尺寸
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';

        this.canvasContext = canvas.getContext("2d");
        this.canvasContext.scale(dpr, dpr);
      },
      checkMobile() {
        this.isMobile = window.innerWidth <= 500;
      },
      replayAnimation() {
      if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
      this.animationProgress = 0;
      
      // 立即清空画布
      if (this.canvasContext) {
        const canvas = this.$refs.canvas;
        this.canvasContext.clearRect(0, 0, canvas.width, canvas.height);
      }
      
      this.drawAnimatedPaths();
    },
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
          .replace(/(TV第\d+集)/g, '<span style="font-family:Times New Roman">$1</span>')
          .replace(/(TV|CD)/g, '<span style="font-family:Times New Roman">$1</span>')
          .replace(/(◈[^<]*)/g, '<span style="font-family:MadokaRunes;color:#b85c00;font-weight:bold;">$1</span>')
          .replace(/(※[^<]*)/g, '<span style="color:#1976d2;font-weight:bold;">$1</span>')
          .replace(/(【[^】]+】)/g, '<span style="color:#d81b60;font-family:Times New Roman">$1</span>');
      },
      changeEpisode() {
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
        this.animationProgress = 0;
        
        // 立即清空画布
        if (this.canvasContext) {
          const canvas = this.$refs.canvas;
          this.canvasContext.clearRect(0, 0, canvas.width, canvas.height);
        }

        // 强制重排保证容器尺寸正确
        this.$refs.mapContainer.offsetHeight;

        this.$nextTick(() => {
          this.resizeCanvas();
          setTimeout(() => {
            this.drawAnimatedPaths();
          }, 100);
        });
      },
      // 修改drawAnimatedPaths方法
      drawAnimatedPaths() {
        const ctx = this.canvasContext;
        if (!ctx) return;

        const container = this.$refs.mapContainer;
        const width = container.clientWidth;
        const height = container.clientHeight;

        ctx.clearRect(0, 0, width, height);

        const paths = this.visiblePaths;
        if (!paths.length) return;

        // 定义动画参数
        const FLOW_SPEED = 0.02;  // 虚线流动速度
        const DASH_PATTERN = [10, 5]; // 虚线样式

        paths.forEach(path => {
          const pts = path.points
            .map(pid => this.points.find(p => p.id === pid))
            .filter(Boolean)
            .map(p => ({ x: (p.x / 100) * width, y: (p.y / 100) * height }));

          // 计算当前绘制进度
          const totalLength = this.calculatePathLength(pts);
          const currentLength = totalLength * this.animationProgress;

          // 绘制基础路径（已完成部分）
          ctx.beginPath();
          ctx.moveTo(pts[0].x, pts[0].y);
          let drawnLength = 0;

          // 分段绘制路径
          for (let i = 0; i < pts.length - 1; i++) {
            const start = pts[i];
            const end = pts[i + 1];
            const segLength = this.distance(start, end);

            if (drawnLength + segLength <= currentLength) {
              ctx.lineTo(end.x, end.y);
              drawnLength += segLength;
            } else {
              const ratio = (currentLength - drawnLength) / segLength;
              const partialEnd = {
                x: start.x + (end.x - start.x) * ratio,
                y: start.y + (end.y - start.y) * ratio
              };
              ctx.lineTo(partialEnd.x, partialEnd.y);
              break;
            }
          }

          // 绘制实线基底
          ctx.strokeStyle = path.color;
          ctx.lineWidth = 4;
          ctx.stroke();

          // 在已绘制部分添加流动虚线
          if (currentLength > 0) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(pts[0].x, pts[0].y);
            let flowDrawn = 0;

            // 创建流动虚线路径
            for (let i = 0; i < pts.length - 1; i++) {
              const start = pts[i];
              const end = pts[i + 1];
              const segLength = this.distance(start, end);

              if (flowDrawn + segLength <= currentLength) {
                ctx.lineTo(end.x, end.y);
                flowDrawn += segLength;
              } else {
                const ratio = (currentLength - flowDrawn) / segLength;
                const partialEnd = {
                  x: start.x + (end.x - start.x) * ratio,
                  y: start.y + (end.y - start.y) * ratio
                };
                ctx.lineTo(partialEnd.x, partialEnd.y);
                break;
              }
            }

            // 动态虚线效果
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.lineWidth = 2;
            ctx.setLineDash(DASH_PATTERN);
            ctx.lineDashOffset = -performance.now() * FLOW_SPEED; // 时间驱动流动
            ctx.stroke();
            ctx.restore();
          }

          // 绘制流动光点
          if (currentLength > 0) {
            ctx.save();
            let accumulated = 0;
            for (let i = 0; i < pts.length - 1; i++) {
              const start = pts[i];
              const end = pts[i + 1];
              const segLength = this.distance(start, end);

              if (accumulated + segLength > currentLength) {
                const ratio = (currentLength - accumulated) / segLength;
                const pos = {
                  x: start.x + (end.x - start.x) * ratio,
                  y: start.y + (end.y - start.y) * ratio
                };

                // 光点渐变
                const gradient = ctx.createRadialGradient(
                  pos.x, pos.y, 0,
                  pos.x, pos.y, 6
                );
                gradient.addColorStop(0, 'rgba(255,255,255,0.9)');
                gradient.addColorStop(1, 'rgba(255,255,255,0)');

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, 6, 0, Math.PI * 2);
                ctx.fill();
                break;
              }
              accumulated += segLength;
            }
            ctx.restore();
          }
        });

        // 更新动画进度
        if (this.animationProgress < 1) {
          this.animationProgress += 16 / this.animationDuration;
          this.animationFrameId = requestAnimationFrame(this.drawAnimatedPaths);
        } else {
          // 完整绘制后保持流动效果
          this.animationFrameId = requestAnimationFrame(() => {
            this.drawFlowingEffect(); // 持续流动
          });
        }
      },

      // 新增持续流动方法
      drawFlowingEffect() {
        const ctx = this.canvasContext;
        if (!ctx) return;

        const container = this.$refs.mapContainer;
        const width = container.clientWidth;
        const height = container.clientHeight;

        // 清除画布
        ctx.clearRect(0, 0, width, height);

        // 流动效果参数
        const FLOW_SPEED = 0.01; // 减小速度，使光点移动更平滑
        const DASH_PATTERN = [10, 5];
        const FLOW_COLOR = 'rgba(255, 255, 255, 0.8)';

        this.visiblePaths.forEach(path => {
          // 1. 获取路径的像素坐标
          const pts = path.points
            .map(pid => this.points.find(p => p.id === pid))
            .filter(Boolean)
            .map(p => ({
              x: (p.x / 100) * width,
              y: (p.y / 100) * height
            }));

          if (pts.length < 2) return;

          // 2. 绘制路径实线基底
          ctx.beginPath();
          ctx.moveTo(pts[0].x, pts[0].y);
          pts.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
          ctx.strokeStyle = path.color;
          ctx.lineWidth = 4;
          ctx.stroke();

          // 3. 创建路径流动虚线
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(pts[0].x, pts[0].y);
          pts.slice(1).forEach(p => ctx.lineTo(p.x, p.y));

          // 4. 设置流动样式
          ctx.strokeStyle = FLOW_COLOR;
          ctx.lineWidth = 2;
          ctx.setLineDash(DASH_PATTERN);
          ctx.lineDashOffset = -performance.now() * FLOW_SPEED;
          ctx.stroke();

          // 5. 添加流动光点
          const totalLength = this.calculatePathLength(pts);
          const flowPosition = (performance.now() * FLOW_SPEED * 0.06) % 1; // 减小速度
          const currentFlowLength = totalLength * flowPosition;

          let accumulated = 0;
          for (let i = 0; i < pts.length - 1; i++) {
            const start = pts[i];
            const end = pts[i + 1];
            const segLength = this.distance(start, end);

            if (accumulated + segLength > currentFlowLength) {
              const ratio = (currentFlowLength - accumulated) / segLength;
              const pos = {
                x: start.x + (end.x - start.x) * ratio,
                y: start.y + (end.y - start.y) * ratio
              };

              // 绘制光点渐变
              const gradient = ctx.createRadialGradient(
                pos.x, pos.y, 0,
                pos.x, pos.y, 10 // 增大光点大小
              );
              gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)'); // 增加透明度
              gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

              ctx.fillStyle = gradient;
              ctx.beginPath();
              ctx.arc(pos.x, pos.y, 8, 0, Math.PI * 2); // 增大光点半径
              ctx.fill();
              break;
            }
            accumulated += segLength;
          }

          ctx.restore();
        });

        // 保持动画循环
        this.animationFrameId = requestAnimationFrame(this.drawFlowingEffect);
      },
      distance(p1, p2) {
        return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
      },
      calculatePathLength(points) {
        let length = 0;
        for (let i = 0; i < points.length - 1; i++) {
          length += this.distance(points[i], points[i + 1]);
        }
        return length;
      },
      // 根据路径上的多个点和位置(0~1)，计算对应的像素坐标
      getPointOnPath(pixelPoints, position) {
        if (!pixelPoints.length) return { x: 0, y: 0 };
        if (position <= 0) return pixelPoints[0];
        if (position >= 1) return pixelPoints[pixelPoints.length - 1];

        let totalLength = 0;
        const segLengths = [];
        for (let i = 0; i < pixelPoints.length - 1; i++) {
          const len = this.distance(pixelPoints[i], pixelPoints[i + 1]);
          segLengths.push(len);
          totalLength += len;
        }

        let targetLength = totalLength * position;

        let currentLength = 0;
        for (let i = 0; i < segLengths.length; i++) {
          if (currentLength + segLengths[i] >= targetLength) {
            const remain = targetLength - currentLength;
            const ratio = remain / segLengths[i];
            const start = pixelPoints[i];
            const end = pixelPoints[i + 1];
            const x = start.x + (end.x - start.x) * ratio;
            const y = start.y + (end.y - start.y) * ratio;
            return { x, y };
          } else {
            currentLength += segLengths[i];
          }
        }

        // Should not reach here if position is between 0 and 1
        return pixelPoints[pixelPoints.length - 1];
      },
    }
  };
</script>

<style scoped>
  /* .witch-map-container .app-layout {
  background: #2d133b !important;
  padding-top: 8% !important;
} */
  .replay-btn {
    margin-left: 10px;
    padding: 4px 8px;
    background-color: #4a4a4a;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  .replay-btn:hover {
    background-color: #5a5a5a;
  }
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
    aspect-ratio: 16 / 9;
    /* 假设地图是 16:9 比例 */
    background: #2d133b;
    border-radius: 12px;
    /* overflow: hidden; */
  }

  .world-map {
    width: 100%;
    height: 100%;
    object-fit: contain;
    /* 确保地图不裁切 */
  }

  .map-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
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
    background-color: rgba(0, 0, 0, 0.6);
    padding: 2px 6px;
    border-radius: 4px;
    white-space: nowrap;
  }

  .path-tag {
    position: absolute;
    padding: 0 6px;
    background: #d81b60cc;
    color: white;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: bold;
    user-select: none;
    pointer-events: none;
    white-space: nowrap;
    transition: transform 0.3s;
    animation: tagPulse 1.5s infinite;
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

  .episode-selector {
    /* margin: 10px 0; */
    background: #2d133b !important;
    margin-left: 5px;
    margin-bottom: 10px;
    /* margin-top: 10px; */
    padding: 6px 64vw 10px 10px;
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 300px; /* 增加最小宽度 */
    flex-wrap: nowrap; /* 禁止换行 */

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
    z-index: 999;
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

  @media (max-width: 500px) {
      .map-container {
      width: 130% !important;
      height: auto !important;
      left: 50%;
      transform: translateX(-50%) scale(0.9);
      transform-origin: center center;
      margin-left: 0;
      overflow: visible;
    }
    
    .world-map, .map-canvas {
      width: 100% !important;
      height: auto !important;
    }
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
      box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.3);
      margin-top: 2%;
      margin-bottom: 20%;
    }

    .point-icon {
      width: 20px;
      height: 20px;
    }

    .map-container {
      margin-bottom: 40vh;
      /* 为信息面板留出空间 */
    }

    .path-tag {
      /* Add mobile styles for path tags */
      font-size: 0.4rem;
      /* Smaller font size */
      padding: 0 4px;
      /* Smaller padding */
    }

    .episode-selector {
      position: fixed;
      top: 60%;
      left: 0;
      right: 0;
      margin: 0 auto;
      z-index: 200;
      background: rgba(30, 10, 40, 0.92);
      border-radius: 12px;
      width: max-content;
      min-width: 60vw;
      max-width: 90vw;
      padding: 6px 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
    }
  }
</style>