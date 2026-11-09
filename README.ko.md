# Kylin Blog 🦄

**[简体中文](README.md)** | **[English](README.en.md)** | **[日本語](README.ja.md)** | **[한국어](README.ko.md)**

산뜻한 일본풍 디자인의 동적 블로그 시스템입니다. Next.js 기반 풀스택 구현으로, 틸(teal) 색상을 중심으로 한 배색과 글래스모피즘 카드, 프런트엔드와 관리자 페이지를 하나로 통합한 구성이 특징입니다.

## ✨ 기술 스택

| 계층 | 기술 |
| --- | --- |
| 프레임워크 | Next.js 16 (App Router) + React 19 |
| 백엔드 | Next.js Route Handlers (API) |
| 데이터베이스 | SQLite + Prisma 7 + better-sqlite3 |
| 인증 | JWT (httpOnly Cookie) |
| 스타일 | Tailwind CSS 4 + 자체 디자인 시스템 (CSS 변수) |
| 언어 | TypeScript |

## 📦 주요 기능

### 프런트엔드
- **홈**: 상단 고정 글, 최신 글, 활동 피드를 함께 보여 줍니다
- **게시글 시스템**: 목록 / 상세 / 카테고리 / 태그 / 아카이브를 지원하며, 상단 고정, 비밀번호 보호, 조회수 집계를 제공합니다
- **모먼츠 (Moments)**: 짧은 글 작성과 표시
- **방명록**: 방문자 댓글 (회원 가입 없이 작성 가능)
- **친구 링크**: 신청 방식의 친구 링크
- **앨범**: 앨범 단위로 정리하고 표지 이미지와 이미지 뷰어를 제공합니다
- **프로필**: 소개, 후원, 애니메이션 시청 기록 (Bangumi), 음악 플레이어, Type 등
- **위젯**: 날씨 카드 (30분 모듈 단위 캐시로 외부 API 요청을 줄임)
- **산뜻한 일본풍 디자인**: 틸 색상의 앰비언트 글로우 배경, 카드 호버 글로우, 그라데이션 활성 내비게이션, 라이트/다크 테마

### 관리자 페이지 (`/admin`)
- JWT 로그인 인증 (httpOnly Cookie, 1시간 만료)
- 대시보드: 데이터 개요 통계
- 콘텐츠 관리: 게시글 / 모먼츠 / 친구 링크 / 앨범 / 댓글의 생성·조회·수정·삭제
- 사이트 설정: 사이트 이름, 부제목, 설명을 온라인으로 저장 (`data/settings.json`, 5초 캐시)
- 이미지 업로드: 런타임에 업로드하고 `/uploads/[filename]` 라우트를 통해 제공합니다

## 🚀 빠른 시작

```bash
# 1. 의존성 설치 (네이티브 모듈 better-sqlite3 는 플랫폼에 맞는 바이너리가 필요합니다)
npm install

# 2. 데이터베이스 초기화 및 Prisma Client 생성
npx prisma migrate dev --name init
npm run seed        # 선택 사항: 예시 데이터 채우기

# 3. 환경 변수 설정
# .env.example 을 .env 로 복사하고 DATABASE_URL 과 JWT_SECRET 을 입력합니다

# 4. 개발 서버 시작
npm run dev
```

http://localhost:3000 으로 접속하고, 관리자 페이지는 http://localhost:3000/admin 입니다.

## 📁 디렉터리 구조

```
src/
├── app/                 # App Router 페이지와 API
│   ├── (public)/        # 공개 페이지
│   ├── admin/           # 관리자 페이지 (로그인 + 대시보드)
│   ├── api/             # REST API (게시글/모먼츠/친구 링크/앨범/댓글/설정/인증)
│   └── uploads/         # 런타임 업로드 파일 제공
├── components/          # 컴포넌트 (레이아웃, 위젯, 관리자)
└── lib/                 # 유틸리티 (prisma, auth, settings)
prisma/
├── schema.prisma        # 데이터 모델 (User/Post/Moment/Friend/...)
└── seed.ts              # 예시 데이터
data/settings.json       # 사이트 설정 (런타임에 생성)
```

## 🔑 환경 변수

| 변수 | 설명 |
| --- | --- |
| `DATABASE_URL` | SQLite 데이터베이스 연결 (`file:./dev.db`) |
| `JWT_SECRET` | JWT 서명 시크릿 |

## 🛠️ 프로덕션 배포

```bash
npm run build
npm start        # 프로덕션 모드, 기본값은 http://localhost:3000
```

> 참고: 프로덕션 모드(`next start`)에서는 실행 중에 `public/` 에 추가한 파일을 제공하지 않습니다. 이 프로젝트는 `/uploads/[filename]` 동적 라우트로 이를 처리합니다.

## 📜 라이선스

MIT License

---

*Kylin Blog — 기록하고 나누는 산뜻한 공간입니다.*
