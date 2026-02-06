# 🚖 Salary Meter - 배포 가이드 (Deployment Guide)

## 📦 프로젝트 구조

```
salary-meter/
├── index.html              # HTML 엔트리 포인트
├── main.jsx               # React 엔트리 포인트
├── salary-meter.jsx       # 메인 컴포넌트
├── index.css              # Tailwind CSS
├── package.json           # 의존성 관리
├── vite.config.js         # Vite 설정
├── tailwind.config.js     # Tailwind 설정
├── postcss.config.js      # PostCSS 설정
├── vercel.json           # Vercel 배포 설정
├── .gitignore            # Git ignore 파일
└── README.md             # 프로젝트 문서
```

## 🚀 배포 방법

### 옵션 1: Vercel (추천)

#### A. GitHub를 통한 배포 (가장 쉬운 방법)

1. **GitHub 저장소 생성**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/salary-meter.git
   git push -u origin main
   ```

2. **Vercel에서 배포**
   - https://vercel.com 접속
   - "New Project" 클릭
   - GitHub 저장소 연결
   - "salary-meter" 저장소 선택
   - "Deploy" 클릭 (Vercel이 자동으로 Vite 감지)

#### B. Vercel CLI를 통한 배포

1. **Vercel CLI 설치**
   ```bash
   npm install -g vercel
   ```

2. **로그인**
   ```bash
   vercel login
   ```

3. **배포**
   ```bash
   vercel
   ```
   
   프로덕션 배포:
   ```bash
   vercel --prod
   ```

### 옵션 2: Netlify

1. **Netlify CLI 설치**
   ```bash
   npm install -g netlify-cli
   ```

2. **빌드**
   ```bash
   npm run build
   ```

3. **배포**
   ```bash
   netlify deploy --prod --dir=dist
   ```

### 옵션 3: GitHub Pages

1. **gh-pages 패키지 설치**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **package.json에 스크립트 추가**
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     },
     "homepage": "https://YOUR_USERNAME.github.io/salary-meter"
   }
   ```

3. **vite.config.js 수정**
   ```javascript
   export default defineConfig({
     plugins: [react()],
     base: '/salary-meter/'
   })
   ```

4. **배포**
   ```bash
   npm run deploy
   ```

## 🛠️ 로컬 개발

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 http://localhost:5173 열기

### 3. 프로덕션 빌드 테스트
```bash
npm run build
npm run preview
```

## 🎨 커스터마이징

### 색상 변경
`tailwind.config.js`에서 색상 테마를 변경할 수 있습니다:

```javascript
theme: {
  extend: {
    colors: {
      'taxi-green': '#00FF00',
      'taxi-amber': '#FFBF00',
    }
  }
}
```

### 마일스톤 수정
`salary-meter.jsx`의 `MILESTONES` 배열을 수정:

```javascript
const MILESTONES = [
  { price: 5000, name: '커피 한 잔', icon: '☕' },
  { price: 15000, name: '점심 한 끼', icon: '🍱' },
  // ... 추가
];
```

### 폰트 변경
`index.html`의 `<head>`에 Google Fonts 추가:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Orbitron&display=swap" rel="stylesheet">
```

`tailwind.config.js`에서 폰트 설정:

```javascript
fontFamily: {
  'mono': ['Orbitron', 'monospace'],
}
```

## 🔧 트러블슈팅

### 빌드 오류
- Node.js 버전 확인: `node --version` (권장: v16 이상)
- 의존성 재설치: `rm -rf node_modules package-lock.json && npm install`

### 배포 후 빈 화면
- 브라우저 콘솔 확인
- `vite.config.js`의 `base` 경로 확인
- Vercel/Netlify 빌드 로그 확인

### 스타일 미적용
- Tailwind CSS가 제대로 설정되었는지 확인
- `index.css`가 `main.jsx`에서 import되었는지 확인

## 📱 Chrome Extension으로 변환

### 1. manifest.json 생성

```json
{
  "manifest_version": 3,
  "name": "Salary Meter",
  "version": "1.0.0",
  "description": "Real-time salary calculator",
  "action": {
    "default_popup": "index.html",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },
  "permissions": []
}
```

### 2. 빌드 및 패키징

```bash
npm run build
cd dist
# manifest.json과 아이콘 파일 추가
zip -r salary-meter-extension.zip .
```

### 3. Chrome에 로드

1. `chrome://extensions` 접속
2. "개발자 모드" 활성화
3. "압축해제된 확장 프로그램을 로드합니다" 클릭
4. `dist` 폴더 선택

## 🌐 도메인 연결

### Vercel
1. Vercel 대시보드에서 프로젝트 선택
2. "Settings" → "Domains"
3. 커스텀 도메인 추가
4. DNS 레코드 설정 (Vercel이 자동으로 안내)

### Netlify
1. Netlify 대시보드에서 사이트 선택
2. "Domain settings"
3. "Add custom domain"
4. DNS 설정 완료

## 📊 성능 최적화

### 이미지 최적화
- WebP 포맷 사용
- Lazy loading 적용

### 코드 스플리팅
```javascript
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));
```

### PWA로 변환
`vite-plugin-pwa` 설치:
```bash
npm install -D vite-plugin-pwa
```

`vite.config.js` 수정:
```javascript
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Salary Meter',
        short_name: 'SalaryMeter',
        theme_color: '#000000',
      }
    })
  ]
})
```

## 🐛 버그 리포트

이슈가 있다면 GitHub Issues에 등록해주세요.

## 📄 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능합니다.

---

**Happy Earning! 💰**
