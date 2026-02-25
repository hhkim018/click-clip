# clck-clip

클립보드에서 복사한 URL을 자동으로 수집하고, 도메인별 트리 구조로 정리해주는 데스크탑 앱입니다

## 주요 기능

- **클립보드 자동 감지** - URL을 복사하면 자동으로 수집하여 도메인별로 분류
- **중복 URL 방지** - 이미 저장된 URL은 다시 저장하지 않음
- **트리 구조 관리** - 도메인(호스트) 기준으로 URL을 계층형으로 정리
- **드래그 앤 드롭** - 디렉토리 간 항목 자유 이동
- **컨텍스트 메뉴** - 이름 수정, URL 열기, 상세 정보 확인, 삭제
- **URL 상세 정보** - pathname, query parameter 확인
- **디렉토리 추가** - 디렉토리 생성
- **시스템 트레이** - 백그라운드 실행 지원

## 스크린샷

```

```

## 기술 스택

| 구분      | 기술                        |
| --------- | --------------------------- |
| Framework | Electron 35                 |
| Frontend  | React 18                    |
| Tree UI   | react-arborist              |
| Database  | SQLite (better-sqlite3)     |
| Clipboard | electron-clipboard-extended |
| Build     | electron-vite               |

## 프로젝트 구조

```
src/
├── main/                  # Electron 메인 프로세스
│   ├── index.js           # 윈도우 및 트레이 생성
│   └── function/
│       ├── SiteInfoApi.js # IPC 핸들러
│       └── clip/
│           └── Clip.js    # 클립보드 감시
├── renderer/              # React 렌더러
│   └── src/
│       ├── main.jsx       # 엔트리
│       ├── App.css        # 다크 테마 스타일
│       ├── tree/          # 트리 컴포넌트
│       ├── components/    # 공통 컴포넌트 (Header, StatsBar, Modal, Icons)
│       └── hooks/         # 커스텀 훅
├── service/               # 비즈니스 로직
├── mapper/                # DB 쿼리 (DAO)
├── db/                    # DB 설정 및 초기화
└── preload/               # Electron preload 스크립트
```

## 아키텍처

```
Renderer (React) ──IPC──▶ SiteInfoApi ──▶ Service ──▶ Mapper ──▶ SQLite
                                              ▲
Clipboard Monitor ────────────────────────────┘
```

## 시작하기

```bash
# 의존성 설치
npm install

# 개발 모드 실행
npm run dev

# 빌드
npm run build:mac    # macOS
npm run build:win    # Windows
npm run build:linux  # Linux
```

## DB 스키마

```sql
CREATE TABLE site_info (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  parent_id INTEGER,    -- 부모 디렉토리 ID (NULL이면 루트)
  name      TEXT,       -- 표시 이름
  url       TEXT,       -- 전체 URL
  host      TEXT        -- 도메인 (그룹핑 기준)
);
```
