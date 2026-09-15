# 플래닛팝 운영정보

기존 neighborhoodzombiedefense와 같은 깊이에 만든 정적 페이지. 외부 폰트, JavaScript, 추적 도구, 폼 서버를 사용하지 않는다. 메일 링크는 사용자의 메일 앱만 열며 자동 전송하지 않는다.

- `index.html`: 고객지원
- `privacy-policy/index.html`: 개인정보처리방침
- `delete-account/index.html`: 계정 및 데이터 삭제
- `style.css`: 공통 반응형 스타일

사이트 루트를 그대로 배포하면 경로는 다음과 같다. 공개 배포 대상은 GitHub Pages main 브랜치의 사이트 루트다.

- https://evolvekorea.co.kr/evolvegames/planetpop/
- https://evolvekorea.co.kr/evolvegames/planetpop/privacy-policy/
- https://evolvekorea.co.kr/evolvegames/planetpop/delete-account/

## 앱 구현과 일치시킨 사항

- 진행 상황·아이템은 기기 저장. 기기간 클라우드 복원 기능으로 표현하지 않음.
- 온라인 순위는 Google 로그인 이용자에게 제공. Firestore 순위 문서에 포함된 보조 필드까지 공개 범위에 명시.
- 비개인화 광고도 SDK 데이터 처리가 있을 수 있음.
- 실제 삭제 경로는 설정 → 계정 관리 → 게임 계정 삭제.
- 삭제 보호 기록은 요청 후 최소 7일 보호하며, 인증 계정과 순위 삭제를 확인한 뒤 운영 점검 또는 추가 삭제 요청 시 정리한다. 전용 운영 도구는 앱 프로젝트 Backend/maintenance에 있다. 자동 예약 실행으로 표현하지 않는다.
- 확인되지 않은 정해진 처리일수, 법정 보존기간, 데이터센터 국가를 임의로 약속하지 않음.
- 공개 배포 및 HTTPS 확인 후 Unity PlanetPopServiceInfo.asset의 운영자·문의 이메일·두 URL을 연결할 것. onlineServicesVerified는 실기기 로그인·기록 검증 후 별도로 판단.

## 검토 근거 (2026-09-15)

- PlanetPopProfile.cs, FirestoreCompetitionStore.cs, FirebaseCompetition.cs, PlanetPopServiceInfo.cs, firestore.rules
- https://developers.google.com/admob/android/privacy/play-data-disclosure
- https://firebase.google.com/support/privacy
- https://support.google.com/googleplay/android-developer/answer/13327111?hl=ko
