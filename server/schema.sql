-- =========================================
-- 학급 게시판 DB 스키마
-- 실행: MySQL Workbench에서 root로 접속 → 이 파일 열기(File > Open SQL Script) → 번개 아이콘으로 전체 실행
--       (로컬 MySQL의 root 계정을 그대로 쓰므로 계정 생성/권한 부여는 필요 없음)
-- =========================================

-- 1) 데이터베이스 생성 (한글이 깨지지 않도록 utf8mb4 사용)
CREATE DATABASE IF NOT EXISTS board_20503
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE board_20503;

-- 2) 회원 테이블
CREATE TABLE IF NOT EXISTS users (
  id         INT AUTO_INCREMENT PRIMARY KEY,           -- 회원 번호 (자동 증가)
  email      VARCHAR(100) NOT NULL UNIQUE,             -- 이메일 (중복 불가, 로그인 아이디)
  password   VARCHAR(255) NOT NULL,                    -- bcrypt로 암호화된 비밀번호
  nickname   VARCHAR(30)  NOT NULL,                    -- 닉네임
  grade      INT NOT NULL,                             -- 학년
  class_no   INT NOT NULL,                             -- 반
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,       -- 가입일
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
             ON UPDATE CURRENT_TIMESTAMP               -- 수정할 때마다 자동 갱신
);

-- 3) 게시글 테이블
CREATE TABLE IF NOT EXISTS posts (
  id         INT AUTO_INCREMENT PRIMARY KEY,           -- 글 번호
  user_id    INT NOT NULL,                             -- 작성자 (users.id)
  category   ENUM('공지', '수행평가', '자유', '분실물')
             NOT NULL DEFAULT '자유',                  -- 카테고리 (이 4개 값만 허용)
  title      VARCHAR(200) NOT NULL,                    -- 제목
  content    TEXT NOT NULL,                            -- 내용
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,       -- 작성일
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
             ON UPDATE CURRENT_TIMESTAMP,              -- 수정일
  -- 외래키: 회원이 탈퇴(삭제)하면 그 회원의 글도 함께 삭제됨
  CONSTRAINT fk_posts_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
);

-- 4) 확인용
SHOW TABLES;
DESC users;
DESC posts;
