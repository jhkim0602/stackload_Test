stackload – 개발자 기술스택 가이드 플랫폼

실행

```bash
npm run dev
```

데이터 구조(유지보수 가이드)

- public/data/techs.json: 대량 임포트 소스. 각 항목 필드
  - slug, name, category, description, tags[], homepage, docs, logoUrl, resources[]
  - 운영 중 API 응답 시 sourceName: "public/data/techs.json" 자동 부여
- src/lib/data.ts: 핵심 카탈로그(핸드메이드). 정밀 보정/상위 노출 항목
- src/lib/insights-data.ts: 국내 블로그/채용/뉴스 링크(확장 가능)

어디에 표시되나

- 검색(/search): techs.json + data.ts 병합 로딩. 카드에 sourceName가 표시됨
- 기술 상세(/tech/[slug]): 공식 홈페이지/문서/레포/리소스 링크 표시
- 인사이트(/insights): 국내 블로그/채용/뉴스 링크 카드

데이터 업데이트 방법

1) 일괄 추가: public/data/techs.json에 항목 추가 → 저장 → 새로고침
2) 정밀 보정: src/lib/data.ts의 TECHS 배열에 상세 메타/리소스 보완
3) 인사이트 출처: src/lib/insights-data.ts에 KR_BLOGS/KR_JOBS/KR_NEWS 추가

수집(옵션)

- API: POST /api/firecrawl { urls: string[] } → (연동 시) 수집/정제 후 techs.json 병합
- 크론: 외부 스케줄러에서 위 API 호출 or 저장소에 JSON PR

디자인/UX

- 컬러: 블루-바이올렛, 글라스 카드, InView 모션
- 랜딩: Hero 자동완성 검색, Steps, Ticker, Trending/Top/New 탭

주의

- 다크모드 없음(전면 제거)
- 비교 섹션 제거됨 → 인사이트로 대체
