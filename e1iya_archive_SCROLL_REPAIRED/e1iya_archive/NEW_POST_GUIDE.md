# 새 글 올리는 방법

## 가장 간단한 방법 (VS Code)

1. `posts/` 안에 원하는 카테고리 폴더를 만들고 `my-note.md` 파일을 생성해.
2. 아래 템플릿을 복사하고 `id`, 제목, 날짜, 카테고리, 태그, 본문을 바꿔.
3. 로컬에서 바로 확인하려면 처음 한 번 `pip install -r requirements.txt`를 실행해.
4. 글을 수정할 때마다 `python build.py`를 실행하고 `index.html`을 새로고침해.
5. GitHub Pages로 운영 중이라면 GitHub의 `main` 브랜치에 `posts/` 파일을 업로드해. GitHub Actions가 글 목록을 다시 만들고 커밋해.

```markdown
---
id: REC.005
title: My First Post
date: 2026-11-06
category: study/os
tags: [OS, Notes]
featured: false
summary: My first research note.
---

# My First Post

## Introduction

본문은 여기에 적어.

![설명](images/diagram.png)

```python
print('hello archive')
```
```

## 이미지 넣기

예를 들어 `posts/study/os/my-note.md`에서 `![그림](images/diagram.png)`를 사용하려면 그림 파일을 `posts/study/os/images/diagram.png`에 넣어. 이미지 경로는 글 파일 기준으로 처리돼.

## 주의

- `id`는 모든 글에서 고유해야 해.
- `category`는 DIRECTORY의 폴더 경로가 돼.
- `featured: true`는 메인 Featured 영역 후보로 표시해 (최대 3개).
- 새 글이 올라가도 HTML/CSS 디자인은 바뀌지 않아.
- GitHub Actions의 쓰기 권한이 제한되어 있다면 저장소 **Settings → Actions → General → Workflow permissions**에서 `Read and write permissions`가 필요한지 확인해.
- GitHub Pages는 저장소 루트(`/`)에서 배포하도록 설정하는 게 가장 간단해.
