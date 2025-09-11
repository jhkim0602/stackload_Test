# 📋 stackload 기능명세서 및 데이터 수집 가이드

> 현재 구현된 기능과 향후 데이터 수집/연결 전략

## 📊 현재 구현된 기능 (v0.1.0)

### 🏠 홈페이지 (/)
#### 구현 기능
- [x] **히어로 섹션**: 검색창과 주요 CTA 버튼
- [x] **기술 통계 카드**: 총 기술 수, 카테고리 수, 기업 수 표시
- [x] **인기 기술 미리보기**: 상위 6개 기술 카드 표시 (로고, 설명, 카테고리)
- [x] **기업 미리보기**: 상위 6개 기업 정보 (로고, 업종, 기술 개수)
- [x] **반응형 글래스모피즘 디자인**: 모든 디바이스 지원

#### 데이터 소스
- `src/lib/data.ts` - 정적 데이터 (우선 표시용)
- `public/data/techs.json` - 전체 기술 목록
- `public/data/companies.json` - 전체 기업 목록

### 🔍 검색 페이지 (/search)
#### 구현 기능
- [x] **실시간 검색**: Fuse.js 기반 퍼지 검색
- [x] **필터링**: 카테고리별 기술 필터
- [x] **정렬 옵션**: 이름순, 인기도순
- [x] **검색 결과 카드**: 기술 정보 + 로고 표시
- [x] **검색 히스토리**: 최근 검색어 저장

#### 검색 범위
- 기술명 (name)
- 설명 (description) 
- 태그 (tags)
- 카테고리 (category)

### 🛠 기술 상세 페이지 (/tech/[slug])
#### 구현 기능
- [x] **히어로 섹션**
  - 기술 로고 + 이름 + 설명
  - 핵심 지표 (사용 기업 수, 카테고리 순위)
  - 액션 버튼 (공식 사이트, GitHub, 비교)
  - 태그 표시

- [x] **개발자를 위한 실무 가이드**
  - 프로젝트 적합도 (카테고리별 맞춤 추천)
  - 학습 난이도 (5성급 + 설명)
  - 기술별 맞춤 가이드

- [x] **실제 사용 기업 현황**
  - 해당 기술을 사용하는 기업 목록
  - 기업 로고 + 이름 + 업종 표시
  - 최대 6개 미리보기 + 전체 개수

#### 동적 데이터 연결
- 실시간 기업 사용 현황 계산
- 카테고리 내 순위 동적 산출
- 서버사이드 데이터 페칭

### 📈 인사이트 페이지 (/insights)
#### 구현 기능
- [x] **기술 스택 트렌드**: 카테고리별 기술 분포
- [x] **기업별 기술 스택**: 업종별 기업 현황
- [x] **상호작용형 차트**: 클릭 가능한 데이터 시각화
- [x] **필터링**: 업종별, 지역별 필터

### 🎨 공통 UI/UX 시스템
#### 구현 기능
- [x] **shadcn/ui 디자인 시스템**: 일관된 컴포넌트
- [x] **글래스모피즘**: 반투명 카드 + 블러 효과
- [x] **반응형 그리드**: 모바일/태블릿/데스크탑 최적화
- [x] **라이트 테마**: 현재 라이트 모드만 지원
- [x] **로딩 상태**: 스켈레톤 UI
- [x] **Next.js Image 최적화**: 로고 이미지 최적화

### 🧭 네비게이션 시스템
#### 구현 기능
- [x] **헤더 네비게이션**: 탐색, 인사이트 메뉴
- [x] **통합 검색바**: 헤더 내 글로벌 검색
- [x] **사용자 메뉴**: 드롭다운 (향후 확장용)
- [x] **모바일 최적화**: 햄버거 메뉴

### 🔌 API 시스템
#### 구현된 엔드포인트
- [x] **GET /api/techs**: 전체 기술 목록
- [x] **GET /api/companies**: 전체 기업 목록  
- [x] **GET /api/paths**: 학습 로드맵 (현재 미사용)

#### 데이터 플로우
```
JSON Files → API Routes → React Components → UI
     ↓
sourceName 필드로 데이터 출처 추적
```

## 🚀 향후 구현 예정 기능

### Phase 1: 데이터 확장 (1-2개월)
- [ ] **기술 상세 정보 확장**
  - 공식 문서 링크
  - 학습 리소스 링크
  - 커뮤니티 링크
  
- [ ] **기업 정보 확장**
  - 기업 규모 (스타트업/중견/대기업)
  - 주요 서비스
  - 채용 링크

### Phase 2: 사용자 기능 (2-3개월)
- [ ] **사용자 인증**: 소셜 로그인
- [ ] **즐겨찾기**: 기술/기업 북마크
- [ ] **컬렉션**: 개인 기술스택 조합
- [ ] **비교 기능**: 기술 간 상세 비교

### Phase 3: 고급 기능 (3-6개월)
- [ ] **추천 시스템**: AI 기반 기술 추천
- [ ] **학습 로드맵**: 개인화된 학습 경로
- [ ] **커뮤니티**: 리뷰 및 댓글 시스템
- [ ] **실시간 알림**: 기술 트렌드 변화

## 📊 데이터 수집 전략 및 가이드

### 🎯 데이터 수집 목표
1. **정확성**: 실제 사용되는 기술스택 정보
2. **실시간성**: 최신 트렌드 반영
3. **완전성**: 국내 주요 IT 기업 커버리지 확대
4. **검증 가능성**: 공개된 소스 기반 데이터

### 📈 현재 데이터 현황

#### 기술 데이터 (techs.json)
```typescript
현재 상태: ~50개 기술
목표 상태: 200+ 기술
완성도: 25%

카테고리별 현황:
- frontend: React, Vue, Angular 등 주요 프레임워크 ✅
- backend: Spring, Django, Express 등 ✅  
- database: MySQL, PostgreSQL, MongoDB 등 ✅
- devops: Docker, Kubernetes 등 기본적인 것만 ⚠️
- mobile: React Native, Flutter 등 부족 ❌
- testing: Jest, Cypress 등 부족 ❌
```

#### 기업 데이터 (companies.json)
```typescript
현재 상태: 12개 기업
목표 상태: 100+ 기업  
완성도: 12%

업종별 현황:
- 대기업: 네이버, 카카오, 라인 등 ✅
- 유니콘: 쿠팡, 토스, 우아한형제들 등 ✅
- 스타트업: 매우 부족 ❌
- 전통기업의 IT부문: 전무 ❌
```

### 🔄 데이터 수집 방법론

#### 1. 자동화된 수집 (70%)
```bash
# GitHub 기반 수집
- 기업 공개 저장소 분석
- package.json, requirements.txt 등 파일 스캔
- GitHub API를 통한 언어/기술 통계

# 채용공고 크롤링  
- 프로그래머스, 잡플래닛, 원티드 등
- 기술스택 키워드 추출
- 정기적 업데이트 (주 1회)

# 기술 블로그 분석
- 각 기업의 기술 블로그 RSS
- 언급되는 기술스택 빈도 분석
- 자연어 처리를 통한 키워드 추출
```

#### 2. 수동 검증 (20%)
```bash
# 공식 발표 자료
- 기업 채용 페이지
- 개발자 컨퍼런스 발표
- 공식 기술 블로그 확인

# 커뮤니티 정보
- LinkedIn, 프로그래머스 등
- 개발자 인터뷰 자료
- 기술 스택 설문조사 결과
```

#### 3. 커뮤니티 기여 (10%)
```bash
# 개발자 직접 제보
- GitHub Issues를 통한 정보 제공
- Pull Request 기반 데이터 개선
- 내부 개발자 검증 시스템
```

### 🛠 데이터 수집 도구 개발 계획

#### Phase 1: 기본 크롤러 (즉시 개발)
```typescript
// tools/data-collector/
├── crawlers/
│   ├── job-sites.ts        // 채용사이트 크롤링
│   ├── github-repos.ts     // GitHub 저장소 분석
│   └── tech-blogs.ts       // 기술 블로그 RSS
├── processors/
│   ├── tech-extractor.ts   // 기술스택 키워드 추출
│   ├── company-matcher.ts  // 기업명 정규화
│   └── data-validator.ts   // 데이터 검증
└── outputs/
    ├── json-generator.ts   // JSON 파일 생성
    └── db-sync.ts          // 데이터베이스 동기화
```

#### Phase 2: AI 기반 분석 (2개월 후)
```python
# ai-analyzer/
├── nlp/
│   ├── tech_extraction.py  // 기술스택 NLP 추출
│   ├── trend_analysis.py   // 트렌드 분석
│   └── similarity.py       // 기술 유사도 계산
├── ml/
│   ├── recommendation.py   // 추천 시스템
│   └── clustering.py       // 기업/기술 클러스터링
└── data/
    ├── training/          // 학습 데이터
    └── models/           // 훈련된 모델
```

### 📊 데이터 품질 관리

#### 데이터 검증 프로세스
```typescript
interface DataQualityCheck {
  // 1차: 자동 검증
  schemaValidation: boolean    // JSON 스키마 준수
  duplicateCheck: boolean      // 중복 데이터 체크
  linkValidation: boolean      // URL 유효성 검사
  imageValidation: boolean     // 로고 이미지 접근성
  
  // 2차: 수동 검증  
  factualAccuracy: boolean     // 사실 정확성 확인
  completeness: number         // 데이터 완전성 점수 (0-100)
  freshness: Date             // 마지막 검증 일시
  
  // 3차: 커뮤니티 검증
  communityScore: number       // 커뮤니티 신뢰도 (1-5)
  reportedIssues: number       // 신고된 문제 수
  verifiedSources: string[]    // 검증된 출처 목록
}
```

#### 데이터 업데이트 주기
```bash
# 실시간 (API 호출시)
- 기본 기술/기업 정보 조회
- 사용자 즐겨찾기/검색 데이터

# 일일 업데이트 (매일 새벽 2시)
- GitHub 통계 데이터
- 채용공고 기술스택 정보
- 기술 블로그 최신 글

# 주간 업데이트 (일요일)  
- 기업 기술스택 변경사항
- 새로운 기업/기술 추가
- 데이터 품질 검증

# 월간 업데이트 (매월 1일)
- 트렌드 분석 리포트
- 데이터 정확성 검토
- 커뮤니티 피드백 반영
```

### 🔗 데이터 연결 전략

#### 1. 관계형 데이터 구조
```sql
-- 기술-기업 다대다 관계
CREATE TABLE tech_company_relations (
  tech_slug VARCHAR(50),
  company_slug VARCHAR(50),
  confidence_score DECIMAL(3,2),  -- 0.00-1.00
  data_source VARCHAR(100),       -- 출처 추적
  last_verified DATE,
  created_at TIMESTAMP,
  PRIMARY KEY (tech_slug, company_slug)
);

-- 기술 간 관계 (연관 기술)
CREATE TABLE tech_relations (
  tech_a VARCHAR(50),
  tech_b VARCHAR(50), 
  relation_type ENUM('alternative', 'complementary', 'prerequisite'),
  strength DECIMAL(3,2),
  PRIMARY KEY (tech_a, tech_b)
);
```

#### 2. 데이터 신뢰도 시스템
```typescript
interface DataConfidence {
  source: 'official' | 'job_posting' | 'github' | 'blog' | 'community'
  reliability: number  // 0-100
  lastVerified: Date
  verificationMethod: string
}

// 신뢰도 가중치
const SOURCE_WEIGHTS = {
  official: 1.0,        // 공식 발표
  job_posting: 0.8,     // 채용공고
  github: 0.7,          // GitHub 코드
  blog: 0.6,            // 기술블로그
  community: 0.4        // 커뮤니티 제보
}
```

### 📋 데이터 수집 실행 계획

#### Week 1-2: 크롤링 인프라 구축
- [ ] 기본 크롤러 개발
- [ ] 데이터 검증 파이프라인
- [ ] 자동화 스크립트 작성

#### Week 3-4: 대량 데이터 수집
- [ ] 주요 채용사이트 크롤링
- [ ] GitHub 조직 저장소 분석  
- [ ] 기술 블로그 RSS 수집

#### Week 5-6: 데이터 정제 및 검증
- [ ] 중복 제거 및 정규화
- [ ] 수동 검증 프로세스
- [ ] 품질 점수 시스템 적용

#### Week 7-8: 프로덕션 배포
- [ ] 정제된 데이터 적용
- [ ] 사용자 피드백 수집
- [ ] 지속적 개선 프로세스 구축

### 🎯 성공 지표 (KPI)

#### 데이터 품질
- **기업 커버리지**: 100+ 기업 (현재 12개)
- **기술 커버리지**: 200+ 기술 (현재 50개)
- **데이터 정확도**: 95%+ (수동 검증 기준)
- **업데이트 주기**: 주 1회 이상

#### 사용자 경험
- **검색 정확도**: 90%+ (관련성 기준)
- **페이지 로딩 속도**: 2초 이하
- **데이터 신선도**: 30일 이내 업데이트

#### 비즈니스 임팩트
- **월간 활성 사용자**: 1,000+ 명
- **기업 채용 연결**: 월 10건 이상
- **커뮤니티 기여**: 월 5건 이상

---

## 📞 데이터 수집 참여 방법

### 🤝 기여 방식
1. **GitHub Issues**: 잘못된 정보 신고
2. **Pull Request**: 데이터 직접 수정
3. **제보 양식**: 새로운 기업/기술 정보 제공
4. **검증 참여**: 커뮤니티 데이터 검토

### 📧 연락처
- **데이터 이슈**: GitHub Issues 활용
- **대량 데이터 제공**: 별도 연락 필요
- **기업 공식 정보**: 공식 채널 통한 연락

---
*마지막 업데이트: 2025-09-11*  
*문서 버전: v1.0*