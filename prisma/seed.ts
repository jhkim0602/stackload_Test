// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 시드 데이터 생성 시작...')

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
        color: '#61DAFB',
        popularity: 95,
        learningResources: [
          {
            title: 'React 공식 문서',
            url: 'https://reactjs.org/docs',
            type: 'documentation'
          }
        ]
      },
      {
        name: 'Next.js',
        slug: 'nextjs',
        category: 'frontend',
        description: 'React 기반 프로덕션 프레임워크',
        logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
        color: '#000000',
        popularity: 90
      },
      {
        name: 'TypeScript',
        slug: 'typescript',
        category: 'language',
        description: 'JavaScript에 타입을 추가한 언어',
        logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
        color: '#3178C6',
        popularity: 88
      },
      {
        name: 'Vue.js',
        slug: 'vue',
        category: 'frontend',
        description: '프로그레시브 JavaScript 프레임워크',
        logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
        color: '#4FC08D',
        popularity: 85
      },
      {
        name: 'Node.js',
        slug: 'nodejs',
        category: 'backend',
        description: 'JavaScript 런타임 환경',
        logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
        color: '#339933',
        popularity: 92
      },
      {
        name: 'Python',
        slug: 'python',
        category: 'language',
        description: '범용 프로그래밍 언어',
        logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
        color: '#3776AB',
        popularity: 94
      },
      {
        name: 'Java',
        slug: 'java',
        category: 'language',
        description: '객체 지향 프로그래밍 언어',
        logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
        color: '#ED8B00',
        popularity: 89
      },
      {
        name: 'Spring',
        slug: 'spring',
        category: 'backend',
        description: 'Java 기반 애플리케이션 프레임워크',
        logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg',
        color: '#6DB33F',
        popularity: 82
      },
      {
        name: 'PostgreSQL',
        slug: 'postgresql',
        category: 'database',
        description: '오픈 소스 관계형 데이터베이스',
        logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
        color: '#336791',
        popularity: 86
      },
      {
        name: 'MySQL',
        slug: 'mysql',
        category: 'database',
        description: '인기 있는 오픈 소스 관계형 데이터베이스',
        logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
        color: '#4479A1',
        popularity: 84
      },
      {
        name: 'MongoDB',
        slug: 'mongodb',
        category: 'database',
        description: 'NoSQL 문서 기반 데이터베이스',
        logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
        color: '#47A248',
        popularity: 81
      },
      {
        name: 'Docker',
        slug: 'docker',
        category: 'devops',
        description: '컨테이너화 플랫폼',
        logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
        color: '#2496ED',
        popularity: 87
      },
      {
        name: 'AWS',
        slug: 'aws',
        category: 'cloud',
        description: 'Amazon Web Services 클라우드 플랫폼',
        logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg',
        color: '#FF9900',
        popularity: 93
      },
      {
        name: 'Kubernetes',
        slug: 'kubernetes',
        category: 'devops',
        description: '컨테이너 오케스트레이션 플랫폼',
        logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg',
        color: '#326CE5',
        popularity: 78
      },
      {
        name: 'Redis',
        slug: 'redis',
        category: 'database',
        description: '인메모리 데이터 구조 저장소',
        logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg',
        color: '#DC382D',
        popularity: 83
      },
      {
        name: 'Flutter',
        slug: 'flutter',
        category: 'mobile',
        description: 'Google의 크로스플랫폼 UI 프레임워크',
        logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg',
        color: '#02569B',
        popularity: 79
      },
      {
        name: 'React Native',
        slug: 'react-native',
        category: 'mobile',
        description: 'React 기반 모바일 앱 개발 프레임워크',
        logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
        color: '#61DAFB',
        popularity: 77
      },
      {
        name: 'Swift',
        slug: 'swift',
        category: 'language',
        description: 'Apple의 iOS/macOS 개발 언어',
        logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg',
        color: '#FA7343',
        popularity: 75
      },
      {
        name: 'Kotlin',
        slug: 'kotlin',
        category: 'language',
        description: 'JVM 기반 모던 프로그래밍 언어',
        logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg',
        color: '#7F52FF',
        popularity: 76
      },
      {
        name: 'Go',
        slug: 'go',
        category: 'language',
        description: 'Google에서 개발한 프로그래밍 언어',
        logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg',
        color: '#00ADD8',
        popularity: 80
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

  const testUser4 = await prisma.user.create({
    data: {
      id: 'test-user-4',
      email: 'test4@stackload.kr',
      name: '이모바일',
      location: '대구, 대한민국',
      level: 'MidLevel',
      bio: '모바일 앱 개발 전문가입니다. Flutter와 React Native 경험이 있습니다.',
      socialLinks: {
        github: 'https://github.com/leemobile'
      },
      interests: ['모바일 개발', 'UI/UX', '크로스플랫폼']
    }
  })

  const testUser5 = await prisma.user.create({
    data: {
      id: 'test-user-5',
      email: 'test5@stackload.kr',
      name: '정학생',
      location: '서울, 대한민국',
      level: 'Student',
      bio: '컴퓨터공학과 4학년 학생입니다. 실무 경험을 쌓고 싶습니다.',
      socialLinks: {
        github: 'https://github.com/jungstudent',
        email: 'test5@stackload.kr'
      },
      interests: ['웹 개발', '알고리즘', '데이터 구조']
    }
  })

  console.log('📝 샘플 커뮤니티 포스트 생성...')

  // 샘플 커뮤니티 포스트 생성
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        authorId: testUser1.id,
        type: 'project',
        title: 'Next.js 13 실시간 채팅 앱 프로젝트 팀원 모집',
        description: '실시간 채팅 애플리케이션을 함께 개발할 팀원을 찾습니다. Socket.io를 활용한 실시간 통신과 MongoDB를 사용한 메시지 저장 기능을 구현할 예정입니다.',
        maxMembers: 4,
        location: '온라인',
        duration: '3개월',
        schedule: '평일 저녁 9시, 주말 오후 2시',
        requirements: [
          'React/Next.js 실무 경험 6개월 이상',
          'TypeScript 사용 가능',
          'Git/GitHub 협업 경험',
          '매주 정기 미팅 참석 가능'
        ],
        benefits: [
          '포트폴리오 제작 지원',
          '코드 리뷰 및 멘토링',
          '실무 경험 쌓기',
          '네트워킹 기회'
        ]
      }
    }),
    
    prisma.post.create({
      data: {
        authorId: testUser2.id,
        type: 'study',
        title: 'React 18 새로운 기능 스터디 그룹',
        description: 'React 18의 새로운 기능들(Concurrent Features, Suspense, etc.)을 함께 학습하고 토론하는 스터디 그룹입니다.',
        maxMembers: 6,
        location: '강남 스터디룸',
        duration: '2개월',
        schedule: '매주 토요일 오후 2시',
        requirements: [
          'React 기초 지식 보유',
          'JavaScript ES6+ 숙지',
          '스터디 참석률 80% 이상 유지'
        ],
        benefits: [
          'React 18 심화 지식 습득',
          '개발자 네트워킹',
          '스터디 자료 공유'
        ]
      }
    }),
    
    prisma.post.create({
      data: {
        authorId: testUser3.id,
        type: 'mentoring',
        title: 'Node.js 백엔드 개발 멘토링',
        description: 'Node.js를 활용한 백엔드 개발을 배우고 싶은 분들을 위한 멘토링입니다. Express, MongoDB, 인증/인가, API 설계 등을 다룹니다.',
        maxMembers: 3,
        location: '온라인',
        duration: '6주',
        schedule: '매주 수요일 저녁 8시',
        requirements: [
          'JavaScript 기초 지식',
          '개발 환경 구축 가능',
          '적극적인 학습 의지'
        ],
        benefits: [
          '1:1 멘토링',
          '실무 중심 교육',
          '프로젝트 피드백',
          '취업 상담'
        ]
      }
    }),
    
    prisma.post.create({
      data: {
        authorId: testUser4.id,
        type: 'project',
        title: 'Flutter 크로스플랫폼 앱 개발 프로젝트',
        description: 'Flutter를 사용한 할일 관리 앱을 개발하는 프로젝트입니다. Firebase와 연동하여 실시간 동기화 기능을 구현합니다.',
        maxMembers: 3,
        location: '부산 코워킹스페이스',
        duration: '4개월',
        schedule: '주중 저녁, 주말 오후',
        requirements: [
          'Flutter/Dart 기초 지식',
          'Firebase 경험 우대',
          '모바일 개발 관심'
        ],
        benefits: [
          '모바일 앱 포트폴리오',
          'Flutter 실무 경험',
          '앱스토어 배포 경험'
        ]
      }
    }),
    
    prisma.post.create({
      data: {
        authorId: testUser5.id,
        type: 'study',
        title: '알고리즘 코딩테스트 스터디',
        description: '취업 준비생들과 함께하는 알고리즘 문제 해결 스터디입니다. 백준, 프로그래머스 문제를 매일 풀고 토론합니다.',
        maxMembers: 8,
        location: '온라인',
        duration: '무제한',
        schedule: '매일 오후 10시 (문제 해설)',
        requirements: [
          '기본적인 프로그래밍 언어 사용 가능',
          '매일 최소 1문제 풀이',
          '주간 문제 해설 참여'
        ],
        benefits: [
          '코딩테스트 실력 향상',
          '취업 준비생 네트워킹',
          '문제 해결 능력 향상'
        ]
      }
    }),
    
    prisma.post.create({
      data: {
        authorId: testUser1.id,
        type: 'project',
        title: 'Vue.js 3 + TypeScript E-commerce 프로젝트',
        description: 'Vue.js 3와 TypeScript를 사용한 이커머스 웹사이트를 개발하는 프로젝트입니다. Pinia 상태관리와 Vite 빌드 도구를 활용합니다.',
        maxMembers: 5,
        location: '온라인',
        duration: '5개월',
        schedule: '매주 화, 목 저녁 9시',
        requirements: [
          'Vue.js 기초 지식',
          'TypeScript 사용 경험',
          'CSS 프레임워크 경험'
        ],
        benefits: [
          '풀스택 개발 경험',
          'Vue 3 Composition API 학습',
          '실제 서비스 배포 경험'
        ]
      }
    }),
    
    prisma.post.create({
      data: {
        authorId: testUser3.id,
        type: 'mentoring',
        title: 'Spring Boot 백엔드 개발 멘토링',
        description: 'Java Spring Boot를 활용한 백엔드 개발을 배우고 싶은 분들을 위한 멘토링입니다. JPA, Security, 테스트 코드 작성법을 다룹니다.',
        maxMembers: 4,
        location: '온라인',
        duration: '8주',
        schedule: '매주 월요일 저녁 7시',
        requirements: [
          'Java 기초 문법 숙지',
          'OOP 개념 이해',
          '데이터베이스 기초 지식'
        ],
        benefits: [
          'Spring Boot 실무 스킬',
          '백엔드 아키텍처 이해',
          '포트폴리오 프로젝트 완성'
        ]
      }
    }),
    
    prisma.post.create({
      data: {
        authorId: testUser2.id,
        type: 'study',
        title: 'UI/UX 디자인 시스템 스터디',
        description: '디자인 시스템 구축과 피그마 활용법을 배우는 스터디입니다. 실제 서비스의 디자인 시스템을 분석하고 구현해봅니다.',
        maxMembers: 6,
        location: '서울 디자인 스튜디오',
        duration: '10주',
        schedule: '매주 일요일 오후 3시',
        requirements: [
          '피그마 기초 사용법',
          'HTML/CSS 기본 지식',
          '디자인에 대한 관심'
        ],
        benefits: [
          '디자인 시스템 구축 능력',
          'UI/UX 포트폴리오 제작',
          '디자이너-개발자 협업 경험'
        ]
      }
    }),
    
    prisma.post.create({
      data: {
        authorId: testUser4.id,
        type: 'project',
        title: '웨어러블 디바이스 연동 헬스케어 앱',
        description: 'Apple Watch, Galaxy Watch와 연동되는 헬스케어 앱을 개발합니다. 심박수, 걸음수 등의 데이터를 분석하여 건강 리포트를 제공합니다.',
        maxMembers: 4,
        location: '온라인',
        duration: '6개월',
        schedule: '매주 토요일 오전 10시',
        requirements: [
          '모바일 앱 개발 경험',
          '헬스케어 도메인 관심',
          'API 연동 경험'
        ],
        benefits: [
          'IoT 연동 앱 개발 경험',
          '헬스테크 도메인 지식',
          '상용 앱 출시 경험'
        ]
      }
    }),
    
    prisma.post.create({
      data: {
        authorId: testUser5.id,
        type: 'study',
        title: '클린 코드와 리팩토링 스터디',
        description: '로버트 마틴의 클린 코드를 읽고 실습하는 스터디입니다. 코드 리뷰를 통해 더 나은 코드 작성법을 배웁니다.',
        maxMembers: 8,
        location: '온라인',
        duration: '12주',
        schedule: '매주 목요일 저녁 8시',
        requirements: [
          '프로그래밍 기초 지식',
          '코드 개선에 대한 관심',
          '책 구매 및 사전 읽기'
        ],
        benefits: [
          '코드 품질 향상',
          '리팩토링 기법 습득',
          '개발자 역량 강화'
        ]
      }
    })
  ])

  // 사용자 기술 스택 연결
  await prisma.userTech.createMany({
    data: [
      { userId: testUser1.id, techName: 'React', proficiencyLevel: 4 },
      { userId: testUser1.id, techName: 'Next.js', proficiencyLevel: 4 },
      { userId: testUser1.id, techName: 'TypeScript', proficiencyLevel: 3 },
      { userId: testUser1.id, techName: 'Node.js', proficiencyLevel: 3 },
      
      { userId: testUser2.id, techName: 'React', proficiencyLevel: 3 },
      { userId: testUser2.id, techName: 'Vue.js', proficiencyLevel: 2 },
      { userId: testUser2.id, techName: 'TypeScript', proficiencyLevel: 2 },
      
      { userId: testUser3.id, techName: 'Node.js', proficiencyLevel: 5 },
      { userId: testUser3.id, techName: 'Java', proficiencyLevel: 4 },
      { userId: testUser3.id, techName: 'Spring', proficiencyLevel: 4 },
      { userId: testUser3.id, techName: 'PostgreSQL', proficiencyLevel: 4 },
      
      { userId: testUser4.id, techName: 'Flutter', proficiencyLevel: 4 },
      { userId: testUser4.id, techName: 'React Native', proficiencyLevel: 3 },
      { userId: testUser4.id, techName: 'Swift', proficiencyLevel: 2 },
      
      { userId: testUser5.id, techName: 'Python', proficiencyLevel: 2 },
      { userId: testUser5.id, techName: 'Java', proficiencyLevel: 2 },
      { userId: testUser5.id, techName: 'React', proficiencyLevel: 1 }
    ],
    skipDuplicates: true
  })

  console.log('✅ 시드 데이터 생성 완료!')
  console.log(`- 기술 스택: ${techs.count}개`)
  console.log(`- 테스트 사용자: 5명`)
  console.log(`- 샘플 포스트: ${posts.length}개`)
  console.log(`- 사용자 기술 스택: 17개`)
}

main()
  .catch((e) => {
    console.error('❌ 시드 데이터 생성 실패:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })