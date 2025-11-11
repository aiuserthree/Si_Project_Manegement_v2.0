# WBS 표 양식 템플릿 가이드

> 본 문서는 `CW_B2B_사업자_청구서_WBS_세부_개발_일정_v0_7_240428.xlsx`의 표 양식 구조를 정의한 템플릿 가이드입니다.  
> Cursor는 이 가이드를 참고하여 동일한 형식의 WBS 표를 생성할 수 있습니다.

---

## 📐 표 양식 전체 구조

```
┌─────────────────────────────────────────────────────────────────┐
│ 1행: 문서 제목                                                   │
├─────────────────────────────────────────────────────────────────┤
│ 2행: 업무 구분 대분류 헤더 (기획/디자인/퍼블리싱/개발/검수)      │
├─────────────────────────────────────────────────────────────────┤
│ 3행: 진행률 및 가중치 정보                                       │
├─────────────────────────────────────────────────────────────────┤
│ 4행: 빈 행                                                       │
├─────────────────────────────────────────────────────────────────┤
│ 5~8행: 환경 정보 (운영/검증/개발 URL)                           │
├─────────────────────────────────────────────────────────────────┤
│ 9행: 빈 행                                                       │
├─────────────────────────────────────────────────────────────────┤
│ 10행: 메인 컬럼 헤더                                             │
├─────────────────────────────────────────────────────────────────┤
│ 11행: 서브 컬럼 헤더 (담당자, 진행률, 일정 등)                   │
├─────────────────────────────────────────────────────────────────┤
│ 12행~: 데이터 행 (작업 항목)                                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎨 행별 상세 구조

### 1행: 문서 제목

| 병합 범위 | 내용 | 정렬 | 배경색 | 글꼴 |
|----------|------|------|--------|------|
| B1:B1 | [프로젝트명]_WBS 세부 개발 일정 | 좌측 정렬 | 없음 | 굵게, 14pt |

**예시:**
```
B2B 사업자 청구서_WBS 세부 개발 일정
```

---

### 2행: 업무 구분 대분류 헤더

| 컬럼 | 병합 범위 | 내용 | 배경색 | 정렬 |
|------|----------|------|--------|------|
| M2 | M2:M2 | 업무구분 | #D9D9D9 | 중앙 |
| N2 | N2:S2 | 기획 | #C9DAF8 (파랑) | 중앙 |
| T2 | T2:Y2 | 디자인 | #C9DAF8 (파랑) | 중앙 |
| Z2 | Z2:AE2 | 퍼블리싱 | #C9DAF8 (파랑) | 중앙 |
| AF2 | AF2:AI2 | 개발 | #C9DAF8 (파랑) | 중앙 |
| AJ2 | AJ2:AM2 | 검수(내부) | #C9DAF8 (파랑) | 중앙 |

**색상 코드:**
- 업무구분: `#D9D9D9` (회색)
- 각 업무 영역: `#C9DAF8` (연한 파랑)

---

### 3행: 진행률 및 가중치 정보

#### 좌측 영역 (진행률 관리)

| 컬럼 | 내용 | 수식/값 |
|------|------|---------|
| I3 | 전체 진행률 | (진행률 계산 수식) |
| J3 | 가중치 | 텍스트 "가중치" |

#### 업무별 작업 수량

| 컬럼 | 업무 영역 | 내용 | 수식 예시 |
|------|-----------|------|----------|
| M3 | 전체 | 전체 | 텍스트 |
| N3 | 기획 | 작업 수 | `=COUNTA(N12:N100)` |
| T3 | 디자인 | 작업 수 | `=COUNTA(T12:T100)` |
| Z3 | 퍼블리싱 | 작업 수 | `=COUNTA(Z12:Z100)` |
| AF3 | 개발 | 작업 수 | `=COUNTA(AF12:AF100)` |
| AJ3 | 검수 | 작업 수 | `=COUNTA(AJ12:AJ100)` |

#### 업무별 가중치

| 컬럼 | 내용 | 값 |
|------|------|----|
| J3 | 기획 가중치 | 0.3 |
| - | 디자인 가중치 | 0.1 |
| - | 퍼블리싱 가중치 | 0.1 |
| - | 개발 가중치 | 0.4 |
| - | 검수 가중치 | 0.1 |

---

### 5~8행: 환경 정보

#### 5행: 헤더

| 컬럼 | 내용 | 배경색 |
|------|------|--------|
| B5 | 구분 | #434343 (진한 회색) |
| C5 | 운영 | #434343 |
| D5 | 검증 | #434343 |
| E5 | 개발 | #434343 |

#### 6행: FO(PC)

| 컬럼 | 내용 |
|------|------|
| B6 | FO(PC) |
| C6 | [프로젝트].coway.com |
| D6 | [프로젝트].coway.blue |
| E6 | [프로젝트].coway.dev |

#### 7행: FO(MO)

| 컬럼 | 내용 |
|------|------|
| B7 | FO(MO) |
| C7 | m.[프로젝트].coway.com |
| D7 | m.[프로젝트].coway.blue |
| E7 | m.[프로젝트].coway.dev |

#### 8행: BO

| 컬럼 | 내용 |
|------|------|
| B8 | BO |
| C8 | https://admin.[프로젝트].coway.com/[경로] |
| D8 | https://admin.[프로젝트].coway.blue/[경로] |
| E8 | https://admin.[프로젝트].coway.dev/[경로] |

---

### 10~11행: 컬럼 헤더

#### 10행: 메인 헤더

| 컬럼 | 병합 | 내용 | 배경색 | 글자색 |
|------|------|------|--------|--------|
| B10 | B10:B11 | 구분 | #434343 | 흰색 |
| C10 | C10:C11 | 1depth | #434343 | 흰색 |
| D10 | D10:D11 | 2depth | #434343 | 흰색 |
| E10 | E10:E11 | 3depth | #434343 | 흰색 |
| F10 | F10:F11 | 페이지 | #434343 | 흰색 |
| G10 | G10:G11 | 기능 정의 | #434343 | 흰색 |
| H10 | H10:H11 | 세부 내용 | #434343 | 흰색 |
| I10 | I10:I11 | Platform | #434343 | 흰색 |
| J10 | J10:J11 | Spec | #434343 | 흰색 |
| K10 | K10:K11 | 비고 | #434343 | 흰색 |
| N10 | N10:S10 | 기획 (피그마 링크) | #C9DAF8 | 검정 |
| T10 | T10:Y10 | 디자인 | #C9DAF8 | 검정 |
| Z10 | Z10:AE10 | 퍼블리싱 | #C9DAF8 | 검정 |
| AF10 | AF10:AI10 | 개발 | #C9DAF8 | 검정 |
| AJ10 | AJ10:AM10 | 검수(내부) | #C9DAF8 | 검정 |

#### 일정 타임라인 헤더

| 컬럼 | 병합 | 내용 |
|------|------|------|
| AN10 | AN10:AR10 | 25년 3월 |
| AS10 | AS10:AW10 | 25년 4월 |
| AX10 | AX10:BB10 | 25년 5월 |
| BC10 | BC10:BG10 | 25년 6월 |
| BH10 | BH10:BL10 | 25년 7월 |

#### 11행: 서브 헤더 (업무 프로세스)

각 업무 영역(기획/디자인/퍼블리싱/개발/검수)마다 동일한 패턴:

| 상대위치 | 내용 | 너비 |
|---------|------|------|
| +0 | 담당자 | 80px |
| +1 | 진행률 | 60px |
| +2 | 시작일 | 100px |
| +3 | 완료예정일 | 100px |
| +4 | 검수 상태 | 80px |
| +5 | 검수 완료일 | 100px |

**기획 영역 (N~S열):**
```
N11: 담당자
O11: 진행률
P11: 시작일
Q11: 완료예정일
R11: 검수 상태
S11: 검수 완료일
```

**디자인 영역 (T~Y열):**
```
T11: 담당자
U11: 진행률
V11: 시작일
W11: 완료예정일
X11: 검수 상태
Y11: 검수 완료일
```

**퍼블리싱 영역 (Z~AE열):**
```
Z11: 담당자
AA11: 진행률
AB11: 시작일
AC11: 완료 예정일
AD11: 검수 상태
AE11: 검수 완료일
```

**개발 영역 (AF~AI열):**
```
AF11: 담당자
AG11: 진행률
AH11: 시작일
AI11: 완료 예정일
```
*주의: 개발은 검수 상태/완료일 컬럼이 없음*

**검수 영역 (AJ~AM열):**
```
AJ11: 담당자
AK11: 진행률
AL11: 시작일
AM11: 완료 예정일
```

#### 11행: 서브 헤더 (일정 타임라인)

각 월별로 5개 주차 컬럼:

**25년 3월 (AN~AR열):**
```
AN11: 1w\n3~7
AO11: 2w\n10~14
AP11: 3w\n17~21
AQ11: 4w\n24~28
AR11: 5w\n31
```

**25년 4월 (AS~AW열):**
```
AS11: 5w\n1~4
AT11: 6w\n7~11
AU11: 7w\n14~18
AV11: 8w\n21~25
AW11: 9w\n28~30
```

**동일 패턴으로 5월, 6월, 7월 계속...**

---

## 📏 컬럼 너비 설정

### 작업 분류 영역

| 컬럼 | 너비 | 비고 |
|------|------|------|
| B (구분) | 80px | FO/BO |
| C (1depth) | 120px | 대분류 |
| D (2depth) | 120px | 중분류 |
| E (3depth) | 120px | 소분류 |
| F (페이지) | 80px | 목록/수정/등록 |

### 기능 정의 영역

| 컬럼 | 너비 | 비고 |
|------|------|------|
| G (기능 정의) | 200px | 주요 기능명 |
| H (세부 내용) | 300px | 상세 구현사항 |
| I (Platform) | 60px | Web/Mobile |
| J (Spec) | 50px | 1차/2차 |
| K (비고) | 150px | 특이사항 |

### 업무 프로세스 영역

| 항목 | 너비 |
|------|------|
| 담당자 | 80px |
| 진행률 | 60px |
| 시작일 | 100px |
| 완료예정일 | 100px |
| 검수 상태 | 80px |
| 검수 완료일 | 100px |

### 일정 타임라인 영역

| 항목 | 너비 |
|------|------|
| 각 주차 | 80px |

---

## 🎨 색상 팔레트

### 헤더 색상

```css
/* 메인 헤더 (작업 분류, 기능 정의, 기술 스펙) */
배경: #434343 (진한 회색)
글자: #FFFFFF (흰색)

/* 업무 구분 헤더 */
배경: #D9D9D9 (밝은 회색)
글자: #000000 (검정)

/* 업무 프로세스 헤더 (기획/디자인/퍼블/개발/검수) */
배경: #C9DAF8 (연한 파랑)
글자: #000000 (검정)

/* 일정 타임라인 헤더 */
배경: #F3F3F3 (매우 밝은 회색)
글자: #000000 (검정)
```

### 데이터 영역 색상

```css
/* 일반 셀 */
배경: #FFFFFF (흰색)
글자: #000000 (검정)

/* 완료된 작업 (진행률 = 1) */
배경: #D9EAD3 (연한 녹색)

/* 진행 중 작업 (0 < 진행률 < 1) */
배경: #FFF2CC (연한 노랑)

/* 미시작 작업 (진행률 = 0) */
배경: #FFFFFF (흰색)
```

---

## 🔢 데이터 형식

### 진행률

```
형식: 소수점 (0.0 ~ 1.0)
표시: 백분율 (0% ~ 100%)
예시: 0.5 → 50%
```

### 날짜

```
형식: YYYY-MM-DD
예시: 2025-03-17
```

### 검수 상태

```
가능한 값:
- 대기
- 검수 요청
- 검수 진행중
- 검수완료
```

---

## 📋 데이터 행 구조 (12행 이후)

### 기본 데이터 행 예시

```
B12: BO
C12: 사업자 청구서 관리
D12: 사업자 관리
E12: 사업자 관리
F12: 목록
G12: 법인/지점별 목록 조회/검색
H12: 선택 항목 발송 여부 일괄 변경 기능
I12: Web
J12: 1차
K12: (비고)

[기획 영역]
N12: 조준형
O12: 1
P12: 2025-03-17
Q12: 2025-03-21
R12: 검수완료
S12: 2025-03-20

[디자인 영역]
T12~Y12: (비어있음 또는 데이터)

[퍼블리싱 영역]
Z12~AE12: (비어있음 또는 데이터)

[개발 영역]
AF12: 박상현
AG12: 1
AH12: 2025-03-24
AI12: 2025-03-28

[검수 영역]
AJ12: 조준형
AK12: 0
AL12: 2025-05-26
AM12: 2025-05-30

[일정 타임라인]
AN12~BL12: (간트 차트 시각화 영역)
```

---

## 🔧 Cursor 구현 가이드

### 1. Python + openpyxl로 생성하기

```python
from openpyxl import Workbook
from openpyxl.styles import Font, Fill, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

def create_wbs_template(project_name):
    wb = Workbook()
    ws = wb.active
    ws.title = "WBS 세부 개발 일정"
    
    # 1행: 문서 제목
    ws['B1'] = f"{project_name}_WBS 세부 개발 일정"
    ws['B1'].font = Font(size=14, bold=True)
    
    # 2행: 업무 구분 헤더
    ws['M2'] = "업무구분"
    ws['M2'].fill = PatternFill(start_color="D9D9D9", end_color="D9D9D9", fill_type="solid")
    ws['M2'].alignment = Alignment(horizontal='center', vertical='center')
    
    # 기획 헤더
    ws.merge_cells('N2:S2')
    ws['N2'] = "기획"
    ws['N2'].fill = PatternFill(start_color="C9DAF8", end_color="C9DAF8", fill_type="solid")
    ws['N2'].alignment = Alignment(horizontal='center', vertical='center')
    
    # 디자인 헤더
    ws.merge_cells('T2:Y2')
    ws['T2'] = "디자인"
    ws['T2'].fill = PatternFill(start_color="C9DAF8", end_color="C9DAF8", fill_type="solid")
    ws['T2'].alignment = Alignment(horizontal='center', vertical='center')
    
    # ... 나머지 헤더들 계속
    
    # 10행: 메인 컬럼 헤더
    headers = {
        'B10': '구분',
        'C10': '1depth',
        'D10': '2depth',
        'E10': '3depth',
        'F10': '페이지',
        'G10': '기능 정의',
        'H10': '세부 내용',
        'I10': 'Platform',
        'J10': 'Spec',
        'K10': '비고'
    }
    
    dark_fill = PatternFill(start_color="434343", end_color="434343", fill_type="solid")
    white_font = Font(color="FFFFFF", bold=True)
    
    for cell, text in headers.items():
        ws[cell] = text
        ws[cell].fill = dark_fill
        ws[cell].font = white_font
        ws[cell].alignment = Alignment(horizontal='center', vertical='center')
        
        # B10:B11 병합
        if cell in ['B10', 'C10', 'D10', 'E10', 'F10', 'G10', 'H10', 'I10', 'J10', 'K10']:
            col = cell[0]
            ws.merge_cells(f'{col}10:{col}11')
    
    # 11행: 서브 헤더 (기획 영역)
    planning_headers = ['담당자', '진행률', '시작일', '완료예정일', '검수 상태', '검수 완료일']
    planning_cols = ['N', 'O', 'P', 'Q', 'R', 'S']
    
    blue_fill = PatternFill(start_color="C9DAF8", end_color="C9DAF8", fill_type="solid")
    
    for col, header in zip(planning_cols, planning_headers):
        cell = f'{col}11'
        ws[cell] = header
        ws[cell].fill = blue_fill
        ws[cell].alignment = Alignment(horizontal='center', vertical='center')
    
    # ... 다른 업무 영역도 동일하게
    
    return wb

# 사용
wb = create_wbs_template("새프로젝트")
wb.save("새프로젝트_WBS.xlsx")
```

### 2. pandas + 스타일링으로 생성하기

```python
import pandas as pd
from openpyxl import load_workbook
from openpyxl.styles import PatternFill, Font, Alignment

def create_wbs_dataframe():
    # 데이터프레임 생성
    columns = [
        '구분', '1depth', '2depth', '3depth', '페이지',
        '기능 정의', '세부 내용', 'Platform', 'Spec', '비고',
        '기획_담당자', '기획_진행률', '기획_시작일', '기획_완료예정일', '기획_검수상태', '기획_검수완료일',
        # ... 나머지 컬럼들
    ]
    
    df = pd.DataFrame(columns=columns)
    
    # 엑셀로 저장
    df.to_excel('wbs_template.xlsx', index=False, sheet_name='WBS 세부 개발 일정')
    
    # 스타일 적용
    wb = load_workbook('wbs_template.xlsx')
    ws = wb.active
    
    # 헤더 스타일 적용
    header_fill = PatternFill(start_color="434343", end_color="434343", fill_type="solid")
    header_font = Font(color="FFFFFF", bold=True)
    
    for cell in ws[1]:
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = Alignment(horizontal='center', vertical='center')
    
    wb.save('wbs_template.xlsx')
    
    return df

df = create_wbs_dataframe()
```

---

## 📌 중요 체크리스트

새로운 WBS 표를 생성할 때 반드시 확인해야 할 사항:

- [ ] 1행: 프로젝트명이 포함된 문서 제목
- [ ] 2행: 업무 구분 헤더 (5개 영역)
- [ ] 3행: 진행률/가중치 계산 수식
- [ ] 5~8행: 환경별 URL 정보
- [ ] 10행: 메인 컬럼 헤더 (진한 회색 배경)
- [ ] 11행: 서브 컬럼 헤더 (연한 파랑 배경)
- [ ] 업무별 6개 컬럼 구조 (담당자/진행률/시작일/완료예정일/검수상태/검수완료일)
- [ ] 월별 5개 주차 컬럼
- [ ] 적절한 셀 병합
- [ ] 일관된 색상 팔레트
- [ ] 컬럼 너비 설정

---

## 💡 활용 예시

### 새 프로젝트의 WBS 생성

```python
# 1. 템플릿 복사
project_name = "AI 챗봇 서비스"
wb = create_wbs_template(project_name)

# 2. 환경 URL 업데이트
ws = wb.active
ws['C6'] = "chatbot.coway.com"
ws['D6'] = "chatbot.coway.blue"
ws['E6'] = "chatbot.coway.dev"

# 3. 데이터 추가
row = 12
ws[f'B{row}'] = "BO"
ws[f'C{row}'] = "챗봇 관리"
ws[f'D{row}'] = "대화 관리"
ws[f'E{row}'] = "대화 이력"
ws[f'F{row}'] = "목록"
ws[f'G{row}'] = "대화 이력 조회/검색"
ws[f'H{row}'] = "날짜별, 사용자별 필터링 기능"
ws[f'I{row}'] = "Web"
ws[f'J{row}'] = "1차"

# 4. 저장
wb.save(f"{project_name}_WBS.xlsx")
```

---

## 📚 참고 사항

- 이 템플릿은 **표 양식 구조**만 정의합니다
- **실제 데이터**(작업 항목, 담당자, 일정 등)는 별도 기능정의서에서 가져옵니다
- Cursor는 이 템플릿을 기반으로 새로운 프로젝트의 WBS를 자동 생성할 수 있습니다

