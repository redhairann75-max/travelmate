// default-data.js - 기본 여행 데이터 (첫 방문 시 자동 로드)

const DefaultData = {
  trips: [
    {
      id: 'tokyo',
      name: '도쿄 여행 2026',
      startDate: '2026-03-21',
      endDate: '2026-03-25',
      currency: 'JPY',
      currencySymbol: '¥',
      exchangeRate: 9.2
    },
    {
      id: 'hongkong',
      name: '홍콩 여행 2026',
      startDate: '2026-04-17',
      endDate: '2026-04-20',
      currency: 'HKD',
      currencySymbol: 'HK$',
      exchangeRate: 170
    }
  ],

  places_tokyo: [
    { id: 's1', date: '2026-03-21', name: '나리타공항 → 호텔', time: '14:00', category: 'transport', memo: '스카이라이너 이용', lat: 35.7648, lng: 140.3864, order: 1 },
    { id: 's2', date: '2026-03-21', name: '아사쿠사 센소지', time: '16:30', category: 'sightseeing', memo: '카미나리몬 사진 필수', lat: 35.7148, lng: 139.7967, order: 2 },
    { id: 's3', date: '2026-03-21', name: '이치란 라멘 아사쿠사점', time: '18:30', category: 'food', memo: '맵기 3단계 추천', lat: 35.7112, lng: 139.7955, order: 3 },
    { id: 's4', date: '2026-03-22', name: '시부야 스크램블 교차로', time: '10:00', category: 'sightseeing', memo: '스타벅스 2층에서 사진', lat: 35.6595, lng: 139.7004, order: 1 },
    { id: 's5', date: '2026-03-22', name: '하라주쿠 타케시타 거리', time: '13:00', category: 'shopping', memo: '크레이프 먹기', lat: 35.6702, lng: 139.7027, order: 2 },
    { id: 's6', date: '2026-03-22', name: '신주쿠 오모이데 요코초', time: '19:00', category: 'food', memo: '야키토리 골목', lat: 35.6938, lng: 139.6989, order: 3 },
    { id: 's7', date: '2026-03-23', name: '츠키지 외시장', time: '09:00', category: 'food', memo: '타마고야키, 해산물 덮밥', lat: 35.6654, lng: 139.7707, order: 1 },
    { id: 's8', date: '2026-03-23', name: '팀랩 보더리스', time: '14:00', category: 'sightseeing', memo: '사전예약 완료', lat: 35.6267, lng: 139.7840, order: 2 },
    { id: 's9', date: '2026-03-24', name: '아키하바라', time: '11:00', category: 'shopping', memo: '피규어, 전자제품', lat: 35.7023, lng: 139.7745, order: 1 },
    { id: 's10', date: '2026-03-24', name: '긴자 유니클로 플래그십', time: '15:00', category: 'shopping', memo: '일본 한정판 구매', lat: 35.6717, lng: 139.7649, order: 2 },
    { id: 's11', date: '2026-03-25', name: '호텔 체크아웃 → 나리타공항', time: '10:00', category: 'transport', memo: '리무진버스', lat: 35.7648, lng: 140.3864, order: 1 }
  ],

  expenses_tokyo: [
    { id: 'e1', date: '2026-03-21', amount: 2520, category: 'transport', description: '스카이라이너 편도' },
    { id: 'e2', date: '2026-03-21', amount: 980, category: 'food', description: '이치란 라멘' },
    { id: 'e3', date: '2026-03-21', amount: 500, category: 'food', description: '센소지 근처 메론빵' },
    { id: 'e4', date: '2026-03-22', amount: 650, category: 'cafe', description: '시부야 스타벅스 말차라떼' },
    { id: 'e5', date: '2026-03-22', amount: 3200, category: 'shopping', description: '하라주쿠 옷 구매' },
    { id: 'e6', date: '2026-03-22', amount: 1800, category: 'food', description: '야키토리 + 맥주' },
    { id: 'e7', date: '2026-03-23', amount: 2100, category: 'food', description: '츠키지 해산물 덮밥' },
    { id: 'e8', date: '2026-03-23', amount: 3800, category: 'sightseeing', description: '팀랩 보더리스 입장권' },
    { id: 'e9', date: '2026-03-24', amount: 5500, category: 'shopping', description: '아키하바라 피규어' },
    { id: 'e10', date: '2026-03-24', amount: 4900, category: 'shopping', description: '유니클로 한정판 3점' },
    { id: 'e11', date: '2026-03-24', amount: 1200, category: 'food', description: '긴자 스시' },
    { id: 'e12', date: '2026-03-25', amount: 3200, category: 'transport', description: '리무진버스 나리타행' }
  ],

  places_hongkong: [
    // Day 1 (4/17) - 시상식 데이
    { id: 'h1', date: '2026-04-17', name: '홍콩국제공항 → ibis 호텔', time: '10:00', category: 'transport', memo: 'Airport Express 24분, HKD 115', lat: 22.2849, lng: 114.1509, order: 1 },
    { id: 'h2', date: '2026-04-17', name: 'ibis Hong Kong Central & Sheung Wan', time: '13:00', category: 'accommodation', memo: '바다전망 객실, 28 Des Voeux Rd W', lat: 22.2870, lng: 114.1490, order: 2 },
    { id: 'h3', date: '2026-04-17', name: 'HKIBIM Award 2025 시상식', time: '19:15', category: 'event', memo: 'Ocean Park Marriott, BIMer of the Year 수상! Business Formal', lat: 22.2468, lng: 114.1743, order: 3 },
    // Day 2 (4/18) - 관광 데이
    { id: 'h4', date: '2026-04-18', name: '호텔 브런치 + 휴식', time: '10:00', category: 'food', memo: '바다 전망 보며 여유로운 아침', lat: 22.2870, lng: 114.1490, order: 1 },
    { id: 'h5', date: '2026-04-18', name: '침사추이 해변 + 스타페리', time: '16:30', category: 'sightseeing', memo: '빅토리아 하버 전경, 침사추이→센트럴 8분', lat: 22.2932, lng: 114.1720, order: 2 },
    { id: 'h6', date: '2026-04-18', name: '소호 거리 + 미드레벨 에스컬레이터', time: '17:00', category: 'sightseeing', memo: '800m 세계 최장 에스컬레이터, 덩라우 벽화', lat: 22.2820, lng: 114.1530, order: 3 },
    { id: 'h7', date: '2026-04-18', name: '소호 저녁 (딤섬/차찬탱)', time: '18:00', category: 'food', memo: '딤섬 HKD 80-150', lat: 22.2815, lng: 114.1535, order: 4 },
    { id: 'h8', date: '2026-04-18', name: '빅토리아 피크 야경', time: '20:00', category: 'sightseeing', memo: '피크트램 패스트트랙, 상행 오른쪽 좌석 추천!', lat: 22.2759, lng: 114.1455, order: 5 },
    { id: 'h9', date: '2026-04-18', name: '템플스트리트 야시장', time: '21:00', category: 'shopping', memo: '홍콩 로컬 문화 체험, 기념품, 야식', lat: 22.3055, lng: 114.1699, order: 6 },
    // Day 3 (4/19) - 쇼핑 데이
    { id: 'h10', date: '2026-04-19', name: 'IFC Mall', time: '12:00', category: 'shopping', memo: '고급 쇼핑몰, 애플스토어, 호텔 도보 15분', lat: 22.2855, lng: 114.1584, order: 1 },
    { id: 'h11', date: '2026-04-19', name: 'Jenny Bakery (코즈웨이베이)', time: '14:30', category: 'shopping', memo: '4-Mix 쿠키 110 HKD, 줄이 긴 편', lat: 22.2790, lng: 114.1830, order: 2 },
    { id: 'h12', date: '2026-04-19', name: 'Eslite 서점 (코즈웨이베이)', time: '15:00', category: 'shopping', memo: '3개 층 대형 서점, 문구, 카페', lat: 22.2782, lng: 114.1851, order: 3 },
    { id: 'h13', date: '2026-04-19', name: 'PMQ 디자인 센터', time: '17:00', category: 'shopping', memo: '로컬 디자이너 가죽 소품, 도자기', lat: 22.2830, lng: 114.1510, order: 4 },
    // Day 4 (4/20) - 귀국
    { id: 'h14', date: '2026-04-20', name: '마지막 브런치', time: '10:00', category: 'food', memo: '여유로운 마지막 식사', lat: 22.2870, lng: 114.1490, order: 1 },
    { id: 'h15', date: '2026-04-20', name: '호텔 → 홍콩국제공항', time: '11:00', category: 'transport', memo: 'Airport Express or 택시, 체크아웃 11:00', lat: 22.3080, lng: 113.9185, order: 2 }
  ],

  expenses_hongkong: [
    // Day 1
    { id: 'x1', date: '2026-04-17', amount: 115, category: 'transport', description: 'Airport Express 공항→홍콩역' },
    { id: 'x2', date: '2026-04-17', amount: 50, category: 'transport', description: '택시 호텔→시상식장' },
    { id: 'x3', date: '2026-04-17', amount: 80, category: 'food', description: '호텔 카페 커피' },
    // Day 2
    { id: 'x4', date: '2026-04-18', amount: 120, category: 'food', description: '호텔 브런치' },
    { id: 'x5', date: '2026-04-18', amount: 5, category: 'transport', description: '스타페리 편도' },
    { id: 'x6', date: '2026-04-18', amount: 100, category: 'food', description: '소호 딤섬 저녁' },
    { id: 'x7', date: '2026-04-18', amount: 75, category: 'sightseeing', description: '피크트램 왕복' },
    { id: 'x8', date: '2026-04-18', amount: 150, category: 'shopping', description: '템플스트리트 기념품' },
    { id: 'x9', date: '2026-04-18', amount: 20, category: 'transport', description: 'MTR 교통비' },
    // Day 3
    { id: 'x10', date: '2026-04-19', amount: 80, category: 'food', description: 'IFC Mall 점심' },
    { id: 'x11', date: '2026-04-19', amount: 110, category: 'shopping', description: 'Jenny Bakery 4-Mix 쿠키' },
    { id: 'x12', date: '2026-04-19', amount: 200, category: 'shopping', description: 'Eslite 서점 문구+서적' },
    { id: 'x13', date: '2026-04-19', amount: 60, category: 'shopping', description: '왓슨 드럭스토어 화장품' },
    { id: 'x14', date: '2026-04-19', amount: 30, category: 'shopping', description: 'Lipton Gold Milk Tea 10박스' },
    { id: 'x15', date: '2026-04-19', amount: 45, category: 'cafe', description: 'PMQ 카페' },
    { id: 'x16', date: '2026-04-19', amount: 20, category: 'transport', description: 'MTR 교통비' },
    // Day 4
    { id: 'x17', date: '2026-04-20', amount: 90, category: 'food', description: '마지막 브런치' },
    { id: 'x18', date: '2026-04-20', amount: 115, category: 'transport', description: 'Airport Express 홍콩역→공항' }
  ]
};
