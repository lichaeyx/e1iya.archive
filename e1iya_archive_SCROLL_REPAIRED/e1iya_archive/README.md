# e1iya.archive — 통합 프로젝트

기존 v1.1~v1.7 ZIP을 따로 관리할 필요 없이 **이 폴더 하나**만 사용하면 돼.

## 실행
1. `index.html`을 브라우저에서 열어 HOME → ARCHIVE를 확인해.
2. `CLICK TO EXPLORE`를 누르면 ARCHIVE로 이동해.
3. 폴더, 태그, 검색, 정렬, 글 목록을 이용해. 글 클릭 시 별도 `article.html`로 이동해.
4. ARTICLE의 `BACK TO ARCHIVE`로 목록에 바로 복귀하고, ARCHIVE의 `HOME`으로 Hero로 돌아가.

## 포함된 기능
- 승인된 Hero 이미지를 그대로 사용하며, 클릭 기반 HOME/ARCHIVE 전환
- PC 3열 DIRECTORY / ARCHIVE / LIVE TERMINAL, 모바일 FILES / ARCHIVE / LOG 탭
- > / ⌄ 폴더 탐색과 부드러운 펼침, 실시간 검색, 태그, 정렬, Featured, Load More, Empty State
- 10개 제한의 타이핑 LIVE TERMINAL (시간 표시 없음)
- 독립 ARTICLE 페이지, Markdown 렌더링 결과, 자동 목차, 코드 복사, 링크 복사, 이전/다음 글
- 읽음 상태 브라우저 저장, ABOUT Identity File
- 다크 네이비 CRT/Pale Blue, 얇은 이탈릭 serif, 스크롤바 스타일

## 글 추가/수정
`posts/` 아래 `.md` 파일을 만들고 파일 맨 위에 YAML frontmatter를 작성해.
샘플 글 4개는 실제 사용자의 원문이 아닌 **시연용 예시 콘텐츠**야.

```
---
id: REC.005
title: My New Research
date: 2026-11-06
category: study/os
tags: [OS, Study]
featured: false
summary: Short description
---

# My New Research

## First observation

Content here.
```

수정 후 프로젝트 루트에서 `python build.py`를 실행하면 `content-data.js`와 `records.json`이 갱신돼.
필요 패키지: `pip install -r requirements.txt`

**중요:** Markdown은 브라우저가 직접 읽는 방식이 아니라 빌드 시 HTML로 변환되어 `content-data.js`에 포함돼. 따라서 로컬에서 `index.html`을 더블클릭해도 콘텐츠를 볼 수 있어. GitHub Pages에는 이 폴더의 파일을 그대로 업로드하면 돼.

## 기존 설계에서 변경된 사항
- 다중 팝업 / Window Manager / Taskbar / Preview → Expand는 사용자의 최신 요청에 따라 **독립 Article 페이지로 대체**했어.
- HOME 이미지는 사용자가 최종 승인한 `assets/hero-wide.png` 그대로야.
- HOME은 스크롤로 진입하지 않고 CLICK TO EXPLORE를 눌러 진입해.
- 본문 내용과 ABOUT 소개 문구는 시연용이므로 실제 운영 전 교체해야 해.

## 확인 범위
JavaScript 구문 검사와 Markdown 빌드 검사를 완료했어. 이 환경의 브라우저 접근 제한 때문에 자동 브라우저 클릭 테스트는 실행하지 못했어.


## HOME 메뉴와 ABOUT 수정
- HOME 상단 메뉴는 `[ ARCHIVE ]`, `[ ABOUT ]` 두 개로 교체했어.
- ABOUT은 HOME에서 열면 HOME 위에, ARCHIVE에서 열면 ARCHIVE 위에 나타나. 닫으면 그 화면 그대로 유지돼.
- ABOUT 소개 문구를 바꾸려면 **`about-content.js`** 파일을 메모장이나 VS Code로 열고 `window.ABOUT_CONTENT` 안의 값을 수정한 뒤 저장하고 새로고침하면 돼.
- 이미지 파일 `assets/hero-nav-two.png`는 승인된 HOME 구성의 상단 메뉴 글자 영역만 변경한 버전이고, 원본 `hero-wide.png`도 보관되어 있어.


## Typography & scrolling fix
- All large headings, archive record titles, ABOUT title and prominent labels use Cormorant Garamond italic (web font with serif fallback).
- ARTICLE scroll is explicitly enabled, overriding the HOME-only scroll lock.
- ABOUT modal has its own scroll area when content exceeds viewport height.
- Internet is needed to fetch the web font on first load; fallback serif remains available offline.

## ARTICLE 휠 스크롤 수정
HOME 전용 CSS의 `html:not(.archive-direct)` 규칙이 ARTICLE 페이지까지 적용되어 페이지 스크롤이 잠기던 문제를 수정했습니다. 이제 해당 규칙은 HOME 요소가 있는 페이지에만 적용됩니다. `article.html`은 문서 자체가 세로 스크롤되도록 설정했습니다. 브라우저 실행 테스트는 환경 제한으로 수행하지 못했습니다.
