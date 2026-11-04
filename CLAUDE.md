# 프로젝트: 학급 게시판 (수행평가)

## 기술 스택 (변경 금지, 버전도 아래 그대로)
- client: React + Vite(JavaScript)
  dependencies: axios ^1.20.0, react ^19.2.8, react-dom ^19.2.8, react-icons ^5.7.0, react-router-dom ^7.18.4, styled-components ^6.5.3
  devDependencies: @eslint/js ^10.0.1, @types/react ^19.3.0, @types/react-dom ^19.3.0, @vitejs/plugin-react ^6.1.2, eslint ^10.13.0, eslint-plugin-react-hooks ^7.1.1, eslint-plugin-react-refresh ^0.5.7, globals ^17.13.0, vite ^8.3.5
- server: Node.js + Express(ES module)
  dependencies: bcrypt ^6.0.0, cors ^2.8.6, dotenv ^18.0.7, express ^5.3.0, jsonwebtoken ^9.0.3, multer ^2.5.0, mysql2 ^3.24.5
  devDependencies: nodemon ^3.1.14
- DB: 로컬 MySQL(Workbench), 접속 127.0.0.1 / 전용 계정 20503, DB 이름은 board_20503
- vite 프록시: /api → http://localhost:5000

## 테이블
- users(id, email unique, password(bcrypt), nickname, grade(학년 int), class_no(반 int), created_at, updated_at)
- posts(id, user_id FK→users.id on delete cascade, category(공지/수행평가/자유/분실물), title, content, created_at, updated_at)

## 필수 요구사항
- 회원: 가입(bcrypt 암호화, 학년·반 입력 포함), 로그인(JWT), 마이페이지 조회·수정(학년·반 포함), 탈퇴
- 게시글: 작성은 로그인 시에만, 수정·삭제는 본인 글만(서버에서도 user_id 검사)
- 메인: 모든 글 전체 목록(누구나 조회) + 카테고리 필터, 각 글에 작성자 닉네임과 학년·반 표시
- JOIN 메뉴 "우리 반 글": 로그인한 사용자와 같은 학년·반 학생들의 글 (posts JOIN users)

## 작업 규칙
- 한 번에 한 단계만 구현하고, 끝나면 내가 직접 확인할 방법을 알려줄 것
- 내가 확인했다고 하면 git add . → git commit -m "Feat: 작업내용" → git push origin main
- .env와 node_modules는 절대 커밋하지 않기
- 코드에 한국어 주석을 달아 내가 이해할 수 있게 할 것
- 단계를 끝낼 때마다 아래 진행 기록에 한 줄 추가
- 학교 PC라 매번 대화 기록이 사라짐. 푸시 전에 반드시 진행 기록의 "완료한 단계"와 "다음 할 일"을 갱신할 것
- server/.env.example(비밀번호 없이 키 이름만)을 만들어 커밋할 것 (새 PC에서는 이걸 복사해 server/.env를 만들고, client·server 각각 npm install)

## 진행 기록
### 완료한 단계
- 1단계(초기 세팅) 완료: client(Vite React, 라이브러리, /api 프록시, BrowserRouter, Layout, Home에서 /api/health 확인), server(Express, .env/.env.example, db.js, /api/health), .gitignore, git 원격 연결. health·프록시 정상 확인. DB 연결은 2단계 전이라 실패가 정상
- 2단계(DB 스키마) 완료: server/schema.sql (DB 생성, users·posts 테이블), 화면 제목·헤더 로고 "학급 게시판"으로 변경. 로컬 MySQL에 전용 계정 '20503'@'localhost' 생성, "✅ DB 연결 성공" 확인. git 계정은 이 프로젝트에만(--local) 25s087-del로 설정, 첫 커밋 작성자 변경 후 force push

### 다음 할 일
- 3단계: 회원가입 API (bcrypt, 학년·반 포함)
- (새 PC라면) server/.env.example 복사 → server/.env 작성(DB_USER=20503, 비밀번호), client·server에서 npm install, git config user.name/email(--local) 설정
