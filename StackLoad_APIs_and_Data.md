# StackLoad: API 명세 및 데이터 연동 아키텍처

### 1. 개요: 데이터 흐름 아키텍처

이 프로젝트의 데이터 흐름은 명확한 3-Tier 아키텍처를 따릅니다.

1.  **Presentation Layer (Frontend)**
    *   Next.js의 React Server Components (RSC) 또는 Client Components (`"use client"`)가 사용자 인터페이스를 구성합니다.
    *   데이터가 필요할 때, 브라우저(Client Component) 또는 서버(RSC)는 내부 API 엔드포인트를 호출합니다.

2.  **Application Layer (Backend API)**
    *   `src/app/api/` 디렉토리 하위의 `route.ts` 파일들이 RESTful API 엔드포인트 역할을 합니다.
    *   각 엔드포인트는 요청(Request)을 수신하고, 필요한 비즈니스 로직(인증, 유효성 검사 등)을 수행한 후, 데이터베이스 레이어에 작업을 위임합니다.

3.  **Data Access Layer (Database)**
    *   `src/lib/prisma.ts`를 통해 초기화된 **Prisma Client**가 데이터베이스와의 모든 상호작용을 담당합니다.
    *   API 레이어는 Prisma Client의 메서드(`findMany`, `create`, `update` 등)를 호출하여 SQL 쿼리를 직접 작성하지 않고 데이터베이스와 통신합니다.
    *   데이터베이스는 Supabase에 호스팅된 PostgreSQL입니다.

### 2. 핵심 연동 관리 원칙

*   **API 응답 표준**: `src/lib/api-response.ts` 파일이 존재할 것으로 추정되며, 모든 API 응답은 일관된 JSON 형식을 따릅니다.
    ```json
    // 성공 시
    { "success": true, "data": { ... } }
    // 실패 시
    { "success": false, "error": "에러 메시지" }
    ```
*   **인증 관리**: `src/lib/auth.ts`의 `authOptions`를 사용하여 서버 세션을 확인합니다. 데이터 생성/수정/삭제가 필요한 모든 API는 요청 핸들러 시작 부분에서 아래와 같은 코드로 세션을 검증합니다.
    ```typescript
    import { getServerSession } from "next-auth/next";
    import { authOptions } from "@/lib/auth";

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), { status: 401 });
    }
    // 로그인된 사용자의 ID: session.user.id
    ```
*   **데이터베이스 연결**: 모든 API 파일은 `import prisma from "@/lib/prisma";` 코드를 통해 Prisma Client 인스턴스를 가져와 사용합니다.

### 3. 주요 API 명세 및 데이터베이스 호출 상세

#### 3.1. Posts API (`/api/posts`)

*   **`GET /api/posts`**
    *   **설명**: 커뮤니티 게시글 목록을 페이지네이션하여 조회합니다. 필터링 및 정렬을 지원합니다.
    *   **인증**: 선택 (비회원도 조회 가능)
    *   **요청 (Query Parameters)**:
        *   `page: number` (페이지 번호, e.g., 1)
        *   `limit: number` (페이지 당 아이템 수, e.g., 10)
        *   `type: PostType` (e.g., 'project')
        *   `tech: string` (기술 slug, e.g., 'react')
        *   `sortBy: 'latest' | 'popular'`
    *   **데이터베이스 호출**:
        ```typescript
        // 1. 필터 조건 구성
        const whereClause = {
          ...(type && { type: type }),
          ...(tech && { tags: { some: { tech: { slug: tech } } } })
        };

        // 2. 데이터 조회
        const posts = await prisma.post.findMany({
          where: whereClause,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: {
            ...(sortBy === 'popular' ? { likesCount: 'desc' } : { createdAt: 'desc' })
          },
          include: { // Eager Loading: 연관된 데이터를 함께 불러옴
            author: { select: { id: true, name: true, image: true } },
            tags: { include: { tech: { select: { id: true, name: true, slug: true } } } }
          }
        });

        // 3. 전체 카운트 조회 (페이지네이션을 위해)
        const totalCount = await prisma.post.count({ where: whereClause });
        ```
    *   **응답 (200 OK)**:
        ```json
        {
          "success": true,
          "data": {
            "posts": [ /* Post 객체 배열 */ ],
            "totalCount": 120,
            "totalPages": 12
          }
        }
        ```

*   **`POST /api/posts`**
    *   **설명**: 새로운 게시글을 생성합니다.
    *   **인증**: **필수**
    *   **요청 (Request Body)**:
        ```json
        {
          "title": "사이드 프로젝트 팀원 구합니다",
          "description": "...",
          "type": "project",
          "techIds": [1, 5, 12] // Tech 모델의 ID 배열
        }
        ```
    *   **데이터베이스 호출 (트랜잭션 사용)**: 데이터 무결성을 위해 게시글 생성과 태그 생성을 하나의 트랜잭션으로 묶습니다.
        ```typescript
        const newPost = await prisma.$transaction(async (tx) => {
          // 1. 게시글 생성
          const post = await tx.post.create({
            data: {
              title,
              description,
              type,
              authorId: session.user.id,
            }
          });

          // 2. 기술 태그 연결 (PostTag 레코드 생성)
          if (techIds && techIds.length > 0) {
            await tx.postTag.createMany({
              data: techIds.map(techId => ({
                postId: post.id,
                techId: techId
              }))
            });
          }

          // 3. 사용자 활동 카운트 업데이트
          await tx.user.update({
            where: { id: session.user.id },
            data: { postsCount: { increment: 1 } }
          });

          return post;
        });
        ```
    *   **응답 (201 Created)**:
        ```json
        { "success": true, "data": { /* 생성된 Post 객체 */ } }
        ```

#### 3.2. Comments API (`/api/comments`)

*   **`POST /api/comments`**
    *   **설명**: 특정 게시글(`Post`)에 새로운 댓글을 생성합니다. 대댓글도 지원합니다.
    *   **인증**: **필수**
    *   **요청 (Request Body)**:
        ```json
        {
          "postId": 101,
          "content": "좋은 글이네요!",
          "parentId": null // 대댓글일 경우 부모 댓글의 ID (e.g., 23)
        }
        ```
    *   **데이터베이스 호출 (트랜잭션 사용)**:
        ```typescript
        const newComment = await prisma.$transaction(async (tx) => {
          // 1. 댓글 생성
          const comment = await tx.comment.create({
            data: {
              content,
              postId,
              parentId,
              authorId: session.user.id,
            }
          });

          // 2. 원본 게시글의 댓글 수 업데이트 (Denormalization)
          await tx.post.update({
            where: { id: postId },
            data: { commentsCount: { increment: 1 } }
          });

          // 3. (대댓글일 경우) 부모 댓글의 답글 수 업데이트
          if (parentId) {
            await tx.comment.update({
              where: { id: parentId },
              data: { repliesCount: { increment: 1 } }
            });
          }

          // 4. TODO: 게시글 작성자에게 알림(Notification) 생성 로직 추가

          return comment;
        });
        ```
    *   **응답 (201 Created)**:
        ```json
        { "success": true, "data": { /* 생성된 Comment 객체 */ } }
        ```

#### 3.3. User Profile API (`/api/profile`)

*   **`PUT /api/profile/[userId]`**
    *   **설명**: 사용자의 프로필 정보(자기소개, 기술 스택)를 수정합니다.
    *   **인증**: **필수** (또한, `userId`가 `session.user.id`와 일치하는지 권한 검사 필요)
    *   **요청 (Request Body)**:
        ```json
        {
          "bio": "새로운 기술을 배우는 것을 좋아합니다.",
          "location": "서울",
          "level": "MidLevel",
          "techs": [ // UserTech 정보
            { "techId": 1, "proficiencyLevel": 4 },
            { "techId": 5, "proficiencyLevel": 3 }
          ]
        }
        ```
    *   **데이터베이스 호출 (트랜잭션 사용)**:
        ```typescript
        await prisma.$transaction(async (tx) => {
          // 1. 기본 프로필 정보 업데이트
          await tx.user.update({
            where: { id: userId },
            data: { bio, location, level }
          });

          // 2. 기존 기술 스택 정보 삭제
          await tx.userTech.deleteMany({
            where: { userId: userId }
          });

          // 3. 새로운 기술 스택 정보 추가
          if (techs && techs.length > 0) {
            await tx.userTech.createMany({
              data: techs.map(t => ({
                userId: userId,
                techId: t.techId,
                proficiencyLevel: t.proficiencyLevel
              }))
            });
          }
        });
        ```
    *   **응답 (200 OK)**:
        ```json
        { "success": true, "data": { "message": "Profile updated successfully" } }
        ```

### 4. 종합: End-to-End 연동 시나리오 예시

**시나리오**: 사용자가 커뮤니티 페이지에 접속하여 게시글 목록을 보는 경우

1.  **[Frontend] 데이터 요청**:
    *   사용자가 `/community` 페이지에 접속하면, `src/app/community/page.tsx` 컴포넌트가 렌더링됩니다.
    *   이 컴포넌트는 내부적으로 `fetch('/api/posts?page=1&limit=10')`와 같이 서버 API에 데이터 요청을 보냅니다. (React Server Component의 경우 빌드 시점 또는 요청 시점에 서버 단에서 직접 호출)

2.  **[Backend] API 수신 및 처리**:
    *   `src/app/api/posts/route.ts`의 `GET` 핸들러가 요청을 수신합니다.
    *   URL의 Query Parameter (`page`, `limit`)를 파싱하여 변수에 저장합니다.
    *   (필요 시) `getServerSession`으로 인증 상태를 확인합니다.

3.  **[Backend] 데이터베이스 조회**:
    *   API 핸들러는 `prisma.post.findMany` 메서드를 호출합니다.
    *   이때, `skip`, `take`, `where`, `orderBy`, `include` 등의 옵션을 파라미터로 전달하여 원하는 데이터를 DB에 요청합니다.

4.  **[Backend] 응답 생성**:
    *   Prisma로부터 받은 데이터(게시글 목록, 전체 개수)를 표준 응답 형식에 맞게 JSON 객체로 가공합니다.
    *   `new Response(JSON.stringify({ success: true, data: ... }), { status: 200 })`를 통해 최종 HTTP 응답을 생성하여 반환합니다.

5.  **[Frontend] UI 렌더링**:
    *   `page.tsx` 컴포넌트는 API로부터 받은 JSON 데이터를 상태(state)에 저장합니다.
    *   React는 이 데이터를 기반으로 UI를 렌더링하여 사용자에게 게시글 목록을 보여줍니다.