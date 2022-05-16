class Point {
    constructor(index, x, y) {
      this.x = x;
      this.y = y;
      this.fieldY = y;
      this.speed = 0.07;
      this.cur = index;
      this.max = Math.random() * 100 + 150;
    }
    update() {
      this.cur += this.speed;
      this.y = this.fieldY + Math.sin(this.cur) * this.max;
    }
  }
  class Wave {
    constructor(index, totalPoints, color) {
      this.index = index;
      this.totalPoints = totalPoints;
      this.color = color;
      this.points = []; // 추가
      // this.numberOfPoints = 6; // 추가
    }
    // constructor(color) {
    //     this.color = color;
    //     this.points = []; // 추가
    //     this.numberOfPoints = 6; // 추가
    // }
    resize(stageWidth, stageHeight) {
      this.stageWidth = stageWidth;
      this.stageHeight = stageHeight;
  
      /* 중간을 각각 넓이, 높이를 2로 나눈 값 지정 */
      this.centerX = stageWidth / 2;
      this.centerY = stageHeight / 2;
  
      /* 추가 : 각 점의 간격을 전체넓이 / 점개수 -1  */
      this.pointGap = this.stageWidth / (this.totalPoints - 1);
  
      this.init();
    }
    init() {
      /* 하나의 점 만들기 */
      // this.point = new Point(this.centerX, this.centerY);
      this.points = [];
      /* 추가 : 여러개의 점 */
      for (let i = 0; i < this.totalPoints; i++) {
        // this.points[i] = new Point(i, this.pointGap * i, this.centerY);
        const point = new Point(this.index + i, this.pointGap * i, this.centerY);
        this.points[i] = point;
      }
    }
    draw(ctx) {
      ctx.beginPath();
      ctx.fillStyle = this.color;
      // /* 원 그리기 */
      // ctx.arc(this.points[i].x, this.points[i].y, 30, 0, 2 * Math.PI);
  
      /* 직선모양의 꿀렁꿀렁 */
      // ctx.moveTo(this.points[0].x, this.points[0].y);
  
      /* 곡선 모양의 꿀렁꿀렁 */
      let prevX = this.points[0].x;
      let prevY = this.points[0].y;
  
      ctx.moveTo(prevX, prevY);
  
      for (let i = 1; i < this.totalPoints; i++) {
        /* 직선 파도 */
        // ctx.lineTo(this.points[i].x, this.points[i].y);
  
        // if (i != 0 && i != this.numberOfPoints - 1) {
        //     this.points[i].update();
        // }
  
        if (i < this.totalPoints - 1) {
          this.points[i].update();
        }
  
        /* 곡선 파도 */
        const cx = (prevX + this.points[i].x) / 2;
        const cy = (prevY + this.points[i].y) / 2;
  
        ctx.quadraticCurveTo(prevX, prevY, cx, cy);
  
        prevX = this.points[i].x;
        prevY = this.points[i].y;
  
        // if (i != 0 && i != this.numberOfPoints - 1) {
        //     this.points[i].update();
        // }
      }
      /* 붓을 오른쪽 모서리부터 왼쪽 모서리 그리고 첫번째 점 위치까지 옮기면서 색칠 */
      ctx.lineTo(prevX, prevY);
      ctx.lineTo(this.stageWidth, this.stageHeight);
      ctx.lineTo(0, this.stageHeight);
      ctx.lineTo(this.points[0].x, this.points[0].y);
  
      /* 색 채우기 */
      ctx.fill();
      ctx.closePath();
  
      /* 위치 변경 */
      // this.point.update();
  
      // /* 위치 변경 추가 */
      // if (i != 0 && i != this.numberOfPoints - 1) {
      //     this.points[i].update();
      // }
    }
  }
  class WaveGroup {
    constructor() {
      this.totalWaves = 4;
      this.totalPoints = 6;
  
      this.color = [
        "rgba(100,199,255,0.8)",
        "rgba(174,228,255,0.8)",
        "rgba(196,244,254,0.8)",
        "rgba(196,255,255,0.8)",
      ];
      this.waves = [];
  
      for (let i = 0; i < this.totalWaves; i++) {
        const wave = new Wave(i, this.totalPoints, this.color[i]);
        this.waves[i] = wave;
      }
    }
    resize(stageWidth, stageHeight) {
      for (let i = 0; i < this.totalWaves; i++) {
        const wave = this.waves[i];
        wave.resize(stageWidth, stageHeight);
      }
    }
    draw(ctx) {
      for (let i = 0; i < this.totalWaves; i++) {
        const wave = this.waves[i];
        wave.draw(ctx);
      }
    }
  }
  
  class App {
    constructor() {
      /* 캔버스 엘리먼트 생성 */
      this.canvas = document.createElement("canvas");
  
      /* 그리기 함수 사용하기 위한 getContext 함수 */
      this.ctx = this.canvas.getContext("2d");
  
      /* 현재 html 문서 body에 캔버스 엘리먼트 추가 */
      document.body.appendChild(this.canvas);
  
      this.waveGroup = new WaveGroup();
  
      /* 사이즈 변할 때 대응하는 리스너 */
      window.addEventListener("resize", this.resize.bind(this), {
        once: false,
        passive: false,
        capture: false,
      });
  
      /* Wave 객체 생성 */
      // this.wave = new Wave();
  
      /* 초기 사이즈를 기준으로 resize 함수 실행 */
      this.resize();
  
      /* css로 처리하기 어려운 애니메이션이나 Canvas, SVG 등의 애니메이션 구현에 이용하는 함수 */
      requestAnimationFrame(this.animate.bind(this));
    }
  
    /* 사이즈가 변할 때 실행되는 콜백 */
    resize() {
      /* 레티나 디스플레이에서 올바른 화면을 보여주기 위해 설정 */
      this.stageWidth = document.body.clientWidth;
      this.stageHeight = document.body.clientHeight;
  
      /* 캔버스의 크기를 스테이지의 2배로 잡음 */
      this.canvas.width = this.stageWidth * 2;
      this.canvas.height = this.stageHeight * 2;
  
      /* 캔버스에서 1개의 픽셀이 차지할 크기 정함 */
      this.ctx.scale(2, 2);
  
      /* 웨이브에 리사이즈 적용 */
      this.waveGroup.resize(this.stageWidth, this.stageHeight);
    }
  
    /* 애니메이션 관련 루틴 정의 */
    animate(t) {
      /* 지정된 사각 영역을 rgba(0,0,0,0) 의 색상으로 */
      this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
  
      /* 애니메이션이 실행되면 웨이브가 그려지도록 설정 */
      this.waveGroup.draw(this.ctx);
  
      /* this를 바인드한 채로 애니메이션 프레임 요청 */
      requestAnimationFrame(this.animate.bind(this));
    }
  }
  
  window.onload = () => {
    new App();
  };
  