// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 시드 데이터 생성 시작...')

  // 기존 데이터 정리 (개발환경에서만)
  console.log('🧹 기존 데이터 정리...')
  await prisma.postTag.deleteMany()
  await prisma.userTech.deleteMany()
  await prisma.commentLike.deleteMany()
  await prisma.like.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.post.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.companyTech.deleteMany()
  await prisma.tech.deleteMany()
  await prisma.company.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.user.deleteMany()

  // 기본 기술 스택 데이터 생성
  console.log('📊 기술 스택 데이터 생성...')
  const techs = await prisma.tech.createMany({
    data: [
      {
        name: 'React',
        slug: 'react',
        category: 'frontend',
        description: '사용자 인터페이스 구축을 위한 JavaScript 라이브러리',
        logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
        popularity: 95,
        aiExplanation: 'React는 Facebook에서 개발한 선언적이고 효율적인 JavaScript 라이브러리입니다. 컴포넌트 기반 아키텍처를 통해 재사용 가능한 UI 요소를 만들 수 있으며, Virtual DOM을 사용하여 성능을 최적화합니다. JSX 문법을 사용하여 JavaScript 안에서 HTML과 유사한 코드를 작성할 수 있어 개발자 경험이 뛰어납니다.',
        homepage: 'https://reactjs.org',
        repo: 'https://github.com/facebook/react',
        learningResources: [
          {
            title: 'React 공식 문서',
            url: 'https://reactjs.org/docs',
            type: 'documentation'
          },
          {
            title: 'React 튜토리얼',
            url: 'https://reactjs.org/tutorial/tutorial.html',
            type: 'tutorial'
          }
        ]
      },
      {
        name: 'Next.js',
        slug: 'nextjs',
        category: 'frontend',
        description: 'React 기반 프로덕션 프레임워크',
        logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
        popularity: 90,
        aiExplanation: 'Next.js는 Vercel에서 개발한 React 기반 풀스택 웹 프레임워크입니다. 서버 사이드 렌더링(SSR), 정적 사이트 생성(SSG), API 라우트 등을 지원하며, 성능 최적화와 SEO에 강점이 있습니다. 파일 기반 라우팅 시스템과 자동 코드 분할 기능으로 개발 생산성을 크게 향상시킵니다.',
        homepage: 'https://nextjs.org',
        repo: 'https://github.com/vercel/next.js'
      },
      {
        name: 'TypeScript',
        slug: 'typescript',
        category: 'language',
        description: 'JavaScript에 타입을 추가한 언어',
        logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
        popularity: 88,
        aiExplanation: 'TypeScript는 Microsoft에서 개발한 JavaScript의 상위 집합 언어입니다. 정적 타입 검사를 통해 런타임 오류를 컴파일 타임에 잡아낼 수 있으며, 대규모 애플리케이션 개발 시 코드의 안정성과 유지보수성을 크게 향상시킵니다. 최신 ES 기능을 지원하며 다양한 IDE에서 뛰어난 개발자 도구를 제공합니다.',
        homepage: 'https://www.typescriptlang.org',
        repo: 'https://github.com/microsoft/TypeScript'
      },
      {
        name: 'Vue.js',
        slug: 'vue',
        category: 'frontend',
        description: '프로그레시브 JavaScript 프레임워크',
        logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
        popularity: 85,
        aiExplanation: 'Vue.js는 Evan You가 개발한 프로그레시브 JavaScript 프레임워크입니다. 학습 곡선이 완만하고 기존 프로젝트에 점진적으로 도입할 수 있어 접근성이 뛰어납니다. 템플릿 기반 문법과 양방향 데이터 바인딩을 제공하며, 컴포지션 API를 통해 로직을 재사용 가능한 형태로 구성할 수 있습니다.',
        homepage: 'https://vuejs.org',
        repo: 'https://github.com/vuejs/vue'
      },
      {
        name: 'Node.js',
        slug: 'nodejs',
        category: 'backend',
        description: 'JavaScript 런타임 환경',
        logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
        popularity: 92,
        aiExplanation: 'Node.js는 Chrome V8 JavaScript 엔진을 기반으로 한 서버 사이드 JavaScript 런타임 환경입니다. 이벤트 기반의 비동기 I/O 모델을 사용하여 높은 성능과 확장성을 제공합니다. NPM 생태계를 통해 수많은 오픈소스 패키지를 활용할 수 있으며, 프론트엔드와 백엔드에서 동일한 언어를 사용할 수 있는 장점이 있습니다.',
        homepage: 'https://nodejs.org',
        repo: 'https://github.com/nodejs/node'
      },
      {
        name: 'Python',
        slug: 'python',
        category: 'language',
        description: '범용 프로그래밍 언어',
        logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
        popularity: 94,
        aiExplanation: 'Python은 Guido van Rossum이 개발한 고급 프로그래밍 언어입니다. 간결하고 읽기 쉬운 문법으로 생산성이 높으며, 웹 개발, 데이터 분석, 인공지능, 자동화 등 다양한 분야에서 활용됩니다. 풍부한 라이브러리 생태계와 활발한 커뮤니티를 가지고 있어 학습과 개발에 유리합니다.',
        homepage: 'https://www.python.org',
        repo: 'https://github.com/python/cpython'
      },
      {
        name: 'Java',
        slug: 'java',
        category: 'language',
        description: '객체 지향 프로그래밍 언어',
        logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
        popularity: 89,
        aiExplanation: 'Java는 Sun Microsystems(현 Oracle)에서 개발한 객체 지향 프로그래밍 언어입니다. "Write Once, Run Anywhere" 철학으로 JVM을 통해 플랫폼 독립성을 제공합니다. 강력한 타입 시스템과 메모리 관리, 멀티스레딩 지원으로 대규모 엔터프라이즈 애플리케이션 개발에 널리 사용됩니다.',
        homepage: 'https://www.oracle.com/java',
        repo: 'https://github.com/openjdk/jdk'
      },
      {
        name: 'Spring',
        slug: 'spring',
        category: 'backend',
        description: 'Java 기반 애플리케이션 프레임워크',
        logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg',
        popularity: 82,
        aiExplanation: 'Spring은 Java 기반의 오픈소스 애플리케이션 프레임워크입니다. 의존성 주입(DI)과 관점 지향 프로그래밍(AOP)을 핵심으로 하며, Spring Boot를 통해 복잡한 설정 없이도 빠르게 애플리케이션을 개발할 수 있습니다. 엔터프라이즈급 애플리케이션 개발에 필요한 다양한 기능과 모듈을 제공합니다.',
        homepage: 'https://spring.io',
        repo: 'https://github.com/spring-projects/spring-framework'
      },
      {
        name: 'PostgreSQL',
        slug: 'postgresql',
        category: 'database',
        description: '오픈 소스 관계형 데이터베이스',
        logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
        popularity: 86,
        aiExplanation: 'PostgreSQL은 확장 가능성과 표준 준수를 강조하는 오픈소스 관계형 데이터베이스입니다. ACID 속성을 완전히 지원하며, 복잡한 쿼리, 외래 키, 트리거, 뷰 등 고급 기능을 제공합니다. JSON 데이터 타입 지원과 확장 기능을 통해 NoSQL의 장점도 활용할 수 있습니다.',
        homepage: 'https://www.postgresql.org',
        repo: 'https://github.com/postgres/postgres'
      },
      {
        name: 'MySQL',
        slug: 'mysql',
        category: 'database',
        description: '인기 있는 오픈 소스 관계형 데이터베이스',
        logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
        popularity: 84,
        aiExplanation: 'MySQL은 Oracle에서 개발하고 유지하는 오픈소스 관계형 데이터베이스 관리 시스템입니다. 빠른 성능과 안정성으로 웹 애플리케이션에서 널리 사용되며, LAMP 스택의 핵심 구성 요소입니다. 사용하기 쉽고 다양한 스토리지 엔진을 지원하여 다양한 요구사항에 맞춰 최적화할 수 있습니다.',
        homepage: 'https://www.mysql.com',
        repo: 'https://github.com/mysql/mysql-server'
      },
      {
        name: 'MongoDB',
        slug: 'mongodb',
        category: 'database',
        description: 'NoSQL 문서 기반 데이터베이스',
        logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
        popularity: 81,
        aiExplanation: 'MongoDB는 문서 지향 NoSQL 데이터베이스입니다. JSON과 유사한 BSON 형식으로 데이터를 저장하여 스키마의 유연성을 제공하며, 수평적 확장이 용이합니다. 복잡한 JOIN 없이도 연관된 데이터를 함께 저장할 수 있어 개발 속도가 빠르고, 대용량 데이터 처리에 적합합니다.',
        homepage: 'https://www.mongodb.com',
        repo: 'https://github.com/mongodb/mongo'
      },
      {
        name: 'Docker',
        slug: 'docker',
        category: 'devops',
        description: '컨테이너화 플랫폼',
        logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
        popularity: 87,
        aiExplanation: 'Docker는 애플리케이션을 컨테이너화하여 어디서나 동일하게 실행할 수 있게 해주는 플랫폼입니다. 가상화보다 가볍고 빠르며, 개발, 테스트, 배포 환경을 일관성 있게 관리할 수 있습니다. 마이크로서비스 아키텍처와 CI/CD 파이프라인에서 핵심적인 역할을 하며, 클라우드 네이티브 개발의 필수 도구입니다.',
        homepage: 'https://www.docker.com',
        repo: 'https://github.com/docker/docker-ce'
      }
    ],
    skipDuplicates: true
  })

  // 회사 데이터 생성
  console.log('🏢 회사 데이터 생성...')
  const companies = await prisma.company.createMany({
    data: [
      {
        name: '네이버',
        slug: 'naver',
        description: '대한민국 최대 포털 사이트',
        logoUrl: 'https://placehold.co/64x64/03C75A/FFFFFF?text=N',
        website: 'https://www.navercorp.com',
        size: '5000+',
        industry: 'IT',
        location: '경기도 성남시'
      },
      {
        name: '카카오',
        slug: 'kakao',
        description: '모바일 메신저와 플랫폼 서비스',
        logoUrl: 'https://placehold.co/64x64/FEE500/000000?text=K',
        website: 'https://www.kakaocorp.com',
        size: '1000-5000',
        industry: 'IT',
        location: '제주도'
      },
      {
        name: '삼성전자',
        slug: 'samsung',
        description: '세계적인 전자제품 제조업체',
        logoUrl: 'https://placehold.co/64x64/1428A0/FFFFFF?text=S',
        website: 'https://www.samsung.com',
        size: '10000+',
        industry: '전자',
        location: '경기도 수원시'
      }
    ],
    skipDuplicates: true
  })

  console.log('👤 테스트 사용자 계정 생성...')
  
  // 테스트 사용자 생성
  const testUser1 = await prisma.user.create({
    data: {
      id: 'test-user-1',
      email: 'test1@stackload.kr',
      name: '김개발',
      location: '서울, 대한민국',
      level: 'MidLevel',
      bio: '3년차 풀스택 개발자입니다. React와 Node.js를 주로 사용하며, 새로운 기술 학습을 즐깁니다.',
      socialLinks: {
        github: 'https://github.com/kimdev',
        discord: 'kimdev#1234'
      },
      interests: ['웹 개발', 'AI/ML', '클라우드']
    }
  })

  const testUser2 = await prisma.user.create({
    data: {
      id: 'test-user-2',
      email: 'test2@stackload.kr',
      name: '박프론트',
      location: '부산, 대한민국',
      level: 'Junior',
      bio: '프론트엔드 개발을 좋아하는 주니어 개발자입니다.',
      socialLinks: {
        github: 'https://github.com/parkfront',
        email: 'test2@stackload.kr'
      },
      interests: ['프론트엔드', 'UI/UX', '웹 디자인']
    }
  })

  const testUser3 = await prisma.user.create({
    data: {
      id: 'test-user-3',
      email: 'test3@stackload.kr',
      name: '최백엔드',
      location: '온라인',
      level: 'Senior',
      bio: '백엔드 아키텍처 설계와 성능 최적화에 관심이 많습니다.',
      socialLinks: {
        github: 'https://github.com/choibackend'
      },
      interests: ['백엔드', '데이터베이스', '클라우드']
    }
  })

  console.log('📝 샘플 커뮤니티 포스트 생성...')

  // 기술 ID 조회
  const reactTech = await prisma.tech.findUnique({ where: { slug: 'react' } })
  const nodeTech = await prisma.tech.findUnique({ where: { slug: 'nodejs' } })
  const typescriptTech = await prisma.tech.findUnique({ where: { slug: 'typescript' } })

  // 샘플 커뮤니티 포스트 생성
  const post1 = await prisma.post.create({
    data: {
      authorId: testUser1.id,
      type: 'project',
      title: 'Next.js 13 실시간 채팅 앱 프로젝트 팀원 모집',
      description: `## 프로젝트 개요
실시간 채팅 애플리케이션을 함께 개발할 팀원을 찾습니다.

## 기술 스택
- Next.js 13 (App Router)
- Socket.io
- MongoDB
- TypeScript

## 찾는 분
- React/Next.js 경험이 있는 분
- 실시간 통신에 관심이 있는 분
- 열정적인 분

함께 멋진 프로젝트를 만들어요! 🚀`,
      status: 'recruiting'
    }
  })

  const post2 = await prisma.post.create({
    data: {
      authorId: testUser2.id,
      type: 'study',
      title: 'React 18 새로운 기능 스터디 그룹',
      description: `## 스터디 내용
React 18의 새로운 기능들을 함께 학습하고 토론하는 스터디입니다.

### 학습 주제
- Concurrent Features
- Suspense
- Automatic Batching
- Strict Mode Changes

### 진행 방식
- 주 1회 온라인 미팅
- 각자 학습 후 공유
- 실습 프로젝트 진행

React에 관심 있는 모든 분들 환영합니다! 📚`
    }
  })

  const post3 = await prisma.post.create({
    data: {
      authorId: testUser3.id,
      type: 'mentoring',
      title: 'Node.js 백엔드 개발 멘토링',
      description: `## 멘토링 내용
Node.js를 활용한 백엔드 개발을 배우고 싶은 분들을 위한 멘토링입니다.

### 커리큘럼
1. Express.js 기초
2. MongoDB 연동
3. 인증/인가 시스템
4. RESTful API 설계
5. 성능 최적화

### 멘토 소개
- 5년차 백엔드 개발자
- 스타트업/대기업 경험
- Node.js 전문가

백엔드 개발에 관심 있는 분들의 성장을 도와드리겠습니다! 💪`
    }
  })

  // 포스트에 기술 태그 연결
  if (reactTech) {
    await prisma.postTag.createMany({
      data: [
        { postId: post1.id, techId: reactTech.id },
        { postId: post2.id, techId: reactTech.id }
      ]
    })
  }

  if (nodeTech) {
    await prisma.postTag.create({
      data: { postId: post3.id, techId: nodeTech.id }
    })
  }

  if (typescriptTech) {
    await prisma.postTag.create({
      data: { postId: post1.id, techId: typescriptTech.id }
    })
  }

  // 사용자 기술 스택 연결
  console.log('🛠 사용자 기술 스택 연결...')
  
  // 기술 ID 조회
  const vueTech = await prisma.tech.findUnique({ where: { slug: 'vue' } })
  const javaTech = await prisma.tech.findUnique({ where: { slug: 'java' } })
  const springTech = await prisma.tech.findUnique({ where: { slug: 'spring' } })
  const postgresqlTech = await prisma.tech.findUnique({ where: { slug: 'postgresql' } })
  
  // UserTech 데이터 생성
  const userTechData = []
  
  if (reactTech) {
    userTechData.push(
      { userId: testUser1.id, techId: reactTech.id, proficiencyLevel: 4 },
      { userId: testUser2.id, techId: reactTech.id, proficiencyLevel: 3 }
    )
  }
  
  if (nodeTech) {
    userTechData.push(
      { userId: testUser1.id, techId: nodeTech.id, proficiencyLevel: 3 },
      { userId: testUser3.id, techId: nodeTech.id, proficiencyLevel: 5 }
    )
  }
  
  if (typescriptTech) {
    userTechData.push(
      { userId: testUser1.id, techId: typescriptTech.id, proficiencyLevel: 3 },
      { userId: testUser2.id, techId: typescriptTech.id, proficiencyLevel: 2 }
    )
  }
  
  if (vueTech) {
    userTechData.push({ userId: testUser2.id, techId: vueTech.id, proficiencyLevel: 2 })
  }
  
  if (javaTech) {
    userTechData.push({ userId: testUser3.id, techId: javaTech.id, proficiencyLevel: 4 })
  }
  
  if (springTech) {
    userTechData.push({ userId: testUser3.id, techId: springTech.id, proficiencyLevel: 4 })
  }
  
  if (postgresqlTech) {
    userTechData.push({ userId: testUser3.id, techId: postgresqlTech.id, proficiencyLevel: 4 })
  }
  
  await prisma.userTech.createMany({
    data: userTechData,
    skipDuplicates: true
  })

  // 회사-기술 연결
  console.log('🏢 회사-기술 연결...')
  const naverCompany = await prisma.company.findUnique({ where: { slug: 'naver' } })
  const kakaoCompany = await prisma.company.findUnique({ where: { slug: 'kakao' } })

  if (naverCompany && reactTech && nodeTech) {
    await prisma.companyTech.createMany({
      data: [
        { companyId: naverCompany.id, techId: reactTech.id },
        { companyId: naverCompany.id, techId: nodeTech.id }
      ]
    })
  }

  if (kakaoCompany && reactTech) {
    await prisma.companyTech.create({
      data: { companyId: kakaoCompany.id, techId: reactTech.id }
    })
  }

  // 샘플 댓글 생성
  console.log('💬 샘플 댓글 생성...')
  await prisma.comment.create({
    data: {
      postId: post1.id,
      authorId: testUser2.id,
      content: '흥미로운 프로젝트네요! 참여하고 싶습니다. React 경험이 2년 정도 있어요.'
    }
  })

  await prisma.comment.create({
    data: {
      postId: post2.id,
      authorId: testUser3.id,
      content: 'React 18 공부하고 있었는데 좋은 기회인 것 같아요. 참여 가능할까요?'
    }
  })

  // 좋아요 생성
  console.log('👍 샘플 좋아요 생성...')
  await prisma.like.createMany({
    data: [
      { userId: testUser2.id, postId: post1.id },
      { userId: testUser3.id, postId: post1.id },
      { userId: testUser1.id, postId: post2.id },
      { userId: testUser3.id, postId: post2.id },
      { userId: testUser1.id, postId: post3.id },
      { userId: testUser2.id, postId: post3.id }
    ],
    skipDuplicates: true
  })

  // 좋아요 카운트 업데이트
  await prisma.post.update({
    where: { id: post1.id },
    data: { likesCount: 2, commentsCount: 1 }
  })

  await prisma.post.update({
    where: { id: post2.id },
    data: { likesCount: 2, commentsCount: 1 }
  })

  await prisma.post.update({
    where: { id: post3.id },
    data: { likesCount: 2 }
  })

  console.log('✅ 시드 데이터 생성 완료!')
  console.log(`- 기술 스택: ${techs.count}개`)
  console.log(`- 회사: ${companies.count}개`)
  console.log(`- 테스트 사용자: 3명`)
  console.log(`- 샘플 포스트: 3개`)
  console.log(`- 사용자 기술 스택: 11개`)
  console.log(`- 댓글: 2개`)
  console.log(`- 좋아요: 6개`)
}

main()
  .catch((e) => {
    console.error('❌ 시드 데이터 생성 실패:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })