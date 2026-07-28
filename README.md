# everlib-테마 (everlib-theme)

VS Code 및 호환 에디터(Cursor 등)를 위한 **everlib-테마** (Nekoi Eversoul Garnet Rapture 컬러 테마) 및 **Claude AI 스타일 커스텀 사이드바 패널** 확장 프로그램 프로젝트입니다.

- **Author**: GarnetRapture
- **GitHub Repository**: [https://github.com/GarnetRapture](https://github.com/GarnetRapture)

## 주요 기능

1. **Garnet Rapture Color Theme**:
   - 에버소울 가넷 테마 기반의 다크 레드 & 골드 보라 계열 고급 컬러 팔레트.
   - VS Code Workbench 및 에디터 구문 하이라이팅 완전 지원.

2. **Claude AI Style Custom Sidebar View Panel**:
   - 에디터 좌측 액티비티 바(Activity Bar) 전용 아이콘 배치.
   - WebviewViewProvider 기반 양방향 메세지 통신 대화형 사이드바 인터페이스.
   - 사이드바 내 테마 즉시 적용 및 에디터 인터랙션 명령어 기능 지원.

3. **에디터 투명도 & 배경 월페이퍼 최적화**:
   - `editor.background`에 고도화된 다크 틴트 투명도(`#180d1222`)를 적용하여 메인 코드 가독성(Contrast Ratio)을 100% 보장.
   - 외부 배경 확장(`background` by shalldie 또는 Windows/macOS 투명도)과 연동 시 코드 작성에 방해 없이 `resources/wallpaper/garnet-rapture-costume01.png` 이미지가 자연스럽게 비쳐 보이도록 설계.

### 메인 에디터 월페이퍼 권장 설정 (`settings.json`)
```json
"background.enabled": true,
"background.customImages": [
  "file:///path/to/Nekoi_eversoul_theme/resources/wallpaper/garnet-rapture-costume01.png"
],
"background.editor": {
  "opacity": 0.08,
  "style": {
    "background-size": "cover",
    "background-position": "center center"
  }
}
```

## 프로젝트 구조

```
Nekoi_eversoul_theme/
├── package.json                         # 확장 프로그램 매니페스트 (Views & Themes 매핑)
├── tsconfig.json                        # TypeScript 컴파일 설정
├── .vscodeignore                        # VSIX 패키징 제외 대상 설정
├── README.md                            # 확장 프로그램 안내 문서
├── icon.png                             # 확장 프로그램 대표 아이콘
├── themes/
│   └── nekoi-eversoul-color-theme.json  # 컬러 테마 정의 JSON
├── src/
│   ├── extension.ts                     # 확장 엔트리 포인트 (활성화 & 명령어 등록)
│   └── sidebarProvider.ts               # Claude AI 사이드바 패널 프로바이더
└── resources/                           # 테마 에셋 및 테마 이미지
    ├── icon/
    ├── sticker/
    └── wallpaper/
```

## 개발 및 빌드 안내

```bash
# 디펜던시 설치
npm install

# TypeScript 코드 컴파일
npm run compile

# 패키지 빌드 (.vsix)
npx vsce package
```
