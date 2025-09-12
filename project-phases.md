# 📋 Stackload 프로젝트 진행 현황 및 로드맵 (Rewritten)

## 0. 개요

- 목적: 개발자가 기술을 탐색/비교/학습하고 커뮤니티로 협업할 수 있는 플랫폼 구축
- 현재 버전: v0.1 MVP (웹 UI 완성, DB 스키마 준비, 기본 API 일부)
- 핵심 스택: Next.js 15, TypeScript, Tailwind 4, shadcn/ui, Prisma, PostgreSQL, Vercel

---

## 1. 현재까지의 성과 (요약)

- UI/UX: 랜딩/검색/기술상세/기업/인사이트/커뮤니티/프로필 페이지 제공
- 데이터: `public/data/*.json` 우선 노출 + Prisma 스키마로 DB 구조 확정
- 커뮤니티: 목록/작성 UI, 상세 레이아웃, 통계 필드(likes/comments/views) 설계 반영
- 스키마: 사용자, 포스트, 댓글, 좋아요, 북마크, 태그, 알림, 신청 등 11개 모델 확정
- 배포: GitHub 브랜치(`feature/community-functions`) 푸시, PR 생성 준비
- 도구: Prisma Studio로 로컬 DB 시각화 실행 확인 (`http://localhost:5555`)

---

## 2. 남은 핵심 과제

- 데이터 전환: JSON → DB 읽기 전환(점진) + 시드·검증 파이프라인 정착
- 인증 고도화: NextAuth 프로바이더 환경변수/리다이렉트 정리 + 보호 라우트 확정
- 커뮤니티 실동작: 포스트/댓글/좋아요/북마크 API + UI 바인딩 및 낙관적 업데이트
- 검색 고도화: PostgreSQL FTS(전체 텍스트 검색) + 태그 기반 필터/정렬
- 배포 플로우: Vercel Preview by Branch + 환경변수/시크릿 Dev/Preview/Prod 분리

---

## 3. 단계별 로드맵 (실행 위주)

### Phase A. 데이터/백엔드 전환 (1주)

1. DB 연결 고정

- `.env`에 `POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING` 정리
- `npx prisma db push` 또는 마이그레이션 일원화, `prisma/seed.ts` 실행

2. 읽기 경로 전환

- `/api/techs`, `/api/companies`, `/api/posts`를 DB 우선 읽기로 교체
- JSON은 백업/초기 데이터 시드 용도로만 사용

3. 데이터 검증

- `scripts/verify-schema.ts`, `scripts/check-data.js`를 CI에 연결
- 누락 필드/불일치 자동 검출로 빌드 차단

### Phase B. 커뮤니티 실사용화 (1–2주)

1. 포스트

- 목록/상세/작성/수정/삭제 API 완성, UI 바인딩, 페이지네이션
- 통계(views/likes/comments/applications)는 트리거/서비스 레이어로 일관 업데이트

2. 댓글/대댓글

- CRUD + 중첩 구조(최대 2–3단) + 간단 polling으로 실시간 갱신

3. 좋아요/북마크

- 단일 토글 API (idempotent) + `@@unique` 제약으로 중복 방지

4. 태그/검색

- `post_tags`로 태그 기반 필터, 정렬(최신/인기/마감임박)

### Phase C. 인증/프로필 정리 (3–4일)

- NextAuth 프로바이더(카카오/네이버/Google/GitHub) ENV 정리
- 보호 라우트 가드, 세션 캐싱, 프로필 수정 저장 경로(DB) 확정

### Phase D. 배포/운영 (3–4일)

- Vercel Preview: 브랜치 자동 프리뷰 활성화
- 환경변수/시크릿 Dev/Preview/Prod 분리 등록
- Vercel Analytics, (선택) Sentry 연동

---

## 4. 데이터베이스 모델 핵심 결정 사항

- 정규화: 게시글/댓글 좋아요는 별도 테이블, 카운트는 집계 필드로 저장
- 태그 연결: `post_tags` 다대다, 인덱싱으로 필터 성능 확보
- 사용자 기술: `user_techs`(이름/숙련도) → 필요 시 참조형으로 고도화 가능

---

## 5. 프론트엔드 구현 원칙

- 컴포넌트화: `src/components/ui/*` + 도메인 폴더(`home`, `tech-detail`, `insights`)
- 상태 관리: 전역은 Zustand 최소화, 데이터는 서버 컴포넌트/서버 액션 우선
- 성능: 이미지 최적화, 코드 스플리팅, InView 기반 지연 렌더링
- 접근성/국제화: 기본 ARIA, 한글 우선(영문화는 추후)

---

## 6. 배포 전략

- 브랜치 전략: `main`(배포), `feature/*`(기능) → Vercel 자동 프리뷰
- PR 규칙: 스크린샷/동영상 첨부, 빌드/린트/타입 체크 통과 필수
- 환경변수: Vercel Project Settings에 Dev/Preview/Prod 분리 등록

---

## 7. 품질/운영 지표(KPI)

- 성능: LCP < 2.5s, CLS < 0.1, Lighthouse 90+
- 데이터: 기술 200+, 기업 100+, 주 1회 신선도 업데이트
- 사용성: 검색 정확도 90%+, 월간 활성 1,000+

---

## 8. 단기 실행 체크리스트

- [ ] DB 읽기 전환: `/api/techs`, `/api/companies`, `/api/posts`
- [ ] 커뮤니티 포스트 CRUD + 페이지네이션 + 정렬/필터
- [ ] 댓글/대댓글 CRUD + 실시간 반영(간단 polling)
- [ ] 좋아요/북마크 토글 API + UI 상태 동기화
- [ ] NextAuth ENV 세팅 + 보호 라우팅 점검
- [ ] Vercel Preview by Branch 활성화 + ENV 분리 확인

---

## 9. 참고 링크(내부)

- 모델 설계: `datamodels.md`
- 스키마: `prisma/schema.prisma`
- 시드: `prisma/seed.ts`
- 데이터 검증: `scripts/verify-schema.ts`, `scripts/check-data.js`
