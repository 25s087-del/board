# 학급 게시판

같은 학교 학생들이 공지, 수행평가, 자유, 분실물 글을 함께 보고 쓰는 게시판입니다.
회원가입할 때 학년·반을 입력하고, **우리 반 글** 메뉴에서 같은 학년·반 학생들의 글만 모아 볼 수 있습니다.

## 기술 스택

| 구분 | 사용 기술 |
|---|---|
| Client | React 19, Vite, React Router 7, styled-components, axios, react-icons |
| Server | Node.js, Express 5 (ES module), bcrypt, jsonwebtoken, mysql2, cors, dotenv |
| DB | MySQL (`board_20503`) |

## 기능 목록

### 회원
- 회원가입: 이메일, 비밀번호, 닉네임, 학년(1~3), 반을 입력합니다. 비밀번호는 bcrypt로 암호화해 저장하고, 이미 있는 이메일이면 409를 돌려줍니다.
- 로그인: 로그인하면 JWT(1일 유효)를 발급하고, 토큰과 사용자 정보를 localStorage에 저장합니다.
- 마이페이지: 내 정보를 조회하고 닉네임·학년·반을 수정할 수 있습니다. 비밀번호는 입력했을 때만 변경됩니다.
- 회원 탈퇴: 확인창을 거친 뒤 탈퇴합니다. 탈퇴한 회원의 글은 `ON DELETE CASCADE`로 함께 삭제됩니다.

### 게시글
- 전체 목록: 로그인하지 않아도 볼 수 있습니다. 카테고리(공지/수행평가/자유/분실물)로 거를 수 있고, 각 글에 작성자 닉네임과 학년·반이 표시됩니다.
- 상세 보기: 누구나 볼 수 있습니다.
- 글쓰기: 로그인해야 쓸 수 있습니다.
- 수정·삭제: 본인 글만 가능합니다. 화면에서는 버튼을 숨기고, 서버에서도 `user_id`를 검사해 남의 글이면 403을 돌려줍니다.
- 우리 반 글: 로그인한 사용자와 같은 학년·반 학생들의 글만 보여 줍니다(`posts JOIN users`).

## API

| 메서드 | 주소 | 로그인 | 설명 |
|---|---|---|---|
| POST | `/api/users/signup` | | 회원가입 |
| POST | `/api/users/login` | | 로그인 (token 발급) |
| GET | `/api/users/me` | 필요 | 내 정보 |
| PUT | `/api/users/me` | 필요 | 내 정보 수정 |
| DELETE | `/api/users/me` | 필요 | 회원 탈퇴 |
| GET | `/api/posts?category=` | | 전체 글 목록 |
| GET | `/api/posts/my-class` | 필요 | 우리 반 글 |
| GET | `/api/posts/:id` | | 글 상세 |
| POST | `/api/posts` | 필요 | 글 작성 |
| PUT | `/api/posts/:id` | 필요 (본인) | 글 수정 |
| DELETE | `/api/posts/:id` | 필요 (본인) | 글 삭제 |

로그인이 필요한 요청은 `Authorization: Bearer <토큰>` 헤더를 보내야 합니다.

## 폴더 구조

```
client/
  src/
    api.js              axios 설정 (토큰 자동 첨부)
    AuthContext.jsx     로그인 상태 관리
    styles/theme.js     색·둥글기·그림자 등 디자인 값
    components/         Layout, Form, PostForm, PostCard, CategoryChip
    pages/              Home, Login, Signup, PostDetail, PostCreate, PostEdit, MyPage, ClassPage
server/
  index.js              Express 서버 시작
  db.js                 MySQL 연결
  schema.sql            DB·테이블 생성
  middlewares/auth.js   JWT 검사
  routes/users.js       회원 API
  routes/posts.js       게시글 API
```

## 실행 방법

필요한 것: Node.js, MySQL(Workbench)

### 1. 패키지 설치

```bash
cd client
npm install
cd ../server
npm install
```

### 2. DB 만들기

MySQL Workbench에 root로 접속한 뒤 `File > Open SQL Script`로 `server/schema.sql`을 열고 전체 실행합니다.
DB `board_20503`과 `users`, `posts` 테이블이 만들어집니다.

서버가 접속할 전용 계정을 만듭니다. 비밀번호는 원하는 값으로 바꿔 주세요.

```sql
CREATE USER IF NOT EXISTS '20503'@'localhost' IDENTIFIED BY '비밀번호';
GRANT ALL PRIVILEGES ON board_20503.* TO '20503'@'localhost';
FLUSH PRIVILEGES;
```

### 3. 환경 변수(.env) 설정

`server/.env.example`을 복사해 같은 폴더에 `server/.env`를 만들고 값을 채웁니다.

```
PORT=5000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=20503
DB_PASSWORD=2번에서 정한 비밀번호
DB_NAME=board_20503
JWT_SECRET=아무 긴 문자열
```

`.env`는 비밀번호가 들어 있어 git에 올리지 않습니다(`.gitignore`에 등록됨).

### 4. 실행

터미널 두 개를 엽니다.

```bash
cd server
npm run dev
```

```bash
cd client
npm run dev
```

- 서버 터미널에 `✅ DB 연결 성공`이 나오면 DB가 연결된 것입니다.
- 브라우저에서 http://localhost:5173 에 접속합니다.
- 클라이언트의 `/api` 요청은 Vite 프록시가 `http://localhost:5000`으로 전달합니다.
