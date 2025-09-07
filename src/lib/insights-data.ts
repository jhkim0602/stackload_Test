export type InsightItem = {
  title: string;
  url: string;
  source: string;
  date?: string;
};

export const KR_BLOGS: InsightItem[] = [
  { title: "토스 기술블로그", url: "https://toss.tech/tech", source: "Toss" },
  { title: "우아한형제들 기술블로그", url: "https://techblog.woowahan.com/", source: "Woowahan" },
  { title: "카카오 기술블로그", url: "https://tech.kakao.com/blog/", source: "Kakao" },
  { title: "라인 엔지니어링 블로그", url: "https://engineering.linecorp.com/ko/blog", source: "LINE" },
  { title: "네이버 D2", url: "https://d2.naver.com/home", source: "NAVER" },
];

export const KR_JOBS: InsightItem[] = [
  { title: "원티드 - 백엔드 채용", url: "https://www.wanted.co.kr/wdlist/518?country=kr", source: "Wanted" },
  { title: "사람인 - 개발 채용", url: "https://www.saramin.co.kr/zf_user/jobs/list/domestic", source: "Saramin" },
  { title: "로켓펀치 - 개발자", url: "https://www.rocketpunch.com/jobs?job=developer", source: "Rocketpunch" },
];

export const KR_NEWS: InsightItem[] = [
  { title: "ZDNet Korea - 개발/오픈소스", url: "https://www.zdnet.co.kr/news/?lstcode=0020", source: "ZDNet" },
  { title: "전자신문 - SW/개발", url: "https://www.etnews.com/news/section.html?id1=01", source: "ETNews" },
  { title: "ITWorld Korea", url: "https://www.itworld.co.kr/", source: "ITWorld" },
];


