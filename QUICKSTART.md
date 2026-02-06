# ⚡ Quick Start Guide

## 가장 빠른 배포 방법 (3분 완성!)

### 1️⃣ Vercel로 즉시 배포

```bash
# 1. 의존성 설치
npm install

# 2. Vercel CLI 설치 (처음 한 번만)
npm install -g vercel

# 3. 배포! (그냥 엔터 누르면 됨)
vercel
```

끝! 🎉 Vercel이 자동으로 URL을 제공합니다.

### 2️⃣ 로컬에서 바로 실행하기

```bash
# 1. 의존성 설치
npm install

# 2. 개발 서버 실행
npm run dev
```

브라우저에서 http://localhost:5173 열기

## 📁 파일 설명

- **salary-meter.jsx** - 메인 앱 코드 (모든 기능이 여기에)
- **package.json** - npm 패키지 설정
- **index.html** - HTML 파일
- **main.jsx** - React 진입점
- **vercel.json** - Vercel 배포 설정

## 🎯 핵심 기능

### 택시 모드 (기본)
- 레트로 LED 디스플레이
- 픽셀 말 애니메이션
- 4개 물리 버튼 (설정/주행/할증/지불)

### 일반 모드
- 깔끔한 현대적 디자인
- 심플한 대시보드

### 공통 기능
- 실시간 급여 계산 (초당 업데이트)
- 마일스톤 추적 (커피 한 잔부터 해외여행까지)
- 할증 모드 (1.5x, 2x 등 커스텀 가능)
- 스텔스 바 (마우스 오버 시 확장)
- 정산 기능 (일일/월간 합계)

## 🔧 커스터마이징

### 마일스톤 변경하기
`salary-meter.jsx` 파일 상단의 `MILESTONES` 배열 수정:

```javascript
const MILESTONES = [
  { price: 2000, name: '아메리카노 한 잔', icon: '☕' },
  { price: 10000, name: '뜨끈한 국밥', icon: '🍲' },
  // 여기에 추가하세요!
];
```

### 색상 테마 변경
`salary-meter.jsx`에서 색상 클래스 검색 후 수정:
- `text-green-400` → 다른 색상
- `bg-green-500` → 다른 배경색

## 🚀 프로덕션 빌드

```bash
npm run build
```

`dist` 폴더에 최적화된 파일 생성됨.

## ❓ 문제 해결

### "command not found: npm"
Node.js를 설치하세요: https://nodejs.org

### 포트가 이미 사용중
다른 포트로 실행:
```bash
npm run dev -- --port 3000
```

### 빌드 오류
의존성 재설치:
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📱 Chrome Extension으로 사용하기

1. `npm run build` 실행
2. Chrome에서 `chrome://extensions` 열기
3. "개발자 모드" 활성화
4. "압축해제된 확장 프로그램을 로드합니다"
5. `dist` 폴더 선택

단, `manifest.json` 파일을 먼저 `dist` 폴더에 추가해야 합니다.

## 🎨 데모 URL

배포 후 생성된 URL을 여기에 적어두세요:

**Production URL**: _________________

**Staging URL**: _________________

---

**질문이 있으신가요?** DEPLOYMENT.md를 참고하세요!
