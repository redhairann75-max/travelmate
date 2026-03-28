// app.js - 앱 초기화, 탭 전환, 설정 관리

const App = {
  currentTab: 'itinerary',

  init() {
    // 멀티트립 초기화 (마이그레이션 포함)
    Storage.getTrips();

    // 트립 셀렉터 렌더링
    this.renderTripSelector();

    // 각 모듈 초기화
    Itinerary.init();
    Expenses.init();
    Summary.init();

    // 지도는 탭 전환 시 초기화 (Leaflet은 보이는 상태에서 init 필요)
    this.switchTab('itinerary');
  },

  // 트립 셀렉터 렌더링
  renderTripSelector() {
    const container = document.getElementById('trip-selector');
    if (!container) return;
    const trips = Storage.getTrips();
    const current = Storage.getCurrentTripId();

    container.innerHTML = trips.map(t => `
      <button class="trip-chip ${t.id === current ? 'active' : ''}"
              onclick="App.switchTrip('${t.id}')">
        <span class="trip-chip-flag">${t.id === 'tokyo' ? '🇯🇵' : t.id === 'hongkong' ? '🇭🇰' : '🌏'}</span>
        <span class="trip-chip-name">${t.name.replace(/ \d{4}$/, '')}</span>
      </button>
    `).join('');
  },

  // 트립 전환
  switchTrip(tripId) {
    Storage.setCurrentTrip(tripId);
    // 선택된 날짜를 새 트립의 첫날로 리셋
    const dates = Storage.getTripDates();
    const firstDate = dates.length > 0 ? dates[0] : null;
    Itinerary.selectedDate = firstDate;
    Expenses.selectedDate = 'all';
    this.renderTripSelector();
    this.switchTab(this.currentTab);
  },

  switchTab(tabName) {
    this.currentTab = tabName;

    // 탭 패널 전환
    document.querySelectorAll('.tab-panel').forEach(panel => {
      panel.classList.remove('active');
    });
    document.getElementById('tab-' + tabName).classList.add('active');

    // 탭 버튼 활성화
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    // 탭별 초기화
    if (tabName === 'map') {
      setTimeout(() => TravelMap.init(), 100);
    } else if (tabName === 'summary') {
      Summary.render();
    } else if (tabName === 'expenses') {
      Expenses.render();
    } else if (tabName === 'itinerary') {
      Itinerary.render();
    }
  },

  // 모달 관리
  openModal(modalId) {
    document.getElementById('modal-overlay').classList.add('active');
    document.getElementById(modalId).classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  closeModal() {
    document.getElementById('modal-overlay').classList.remove('active');
    document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
    document.body.style.overflow = '';
  },

  // 설정
  openSettings() {
    const trip = Storage.getTrip();
    document.getElementById('trip-name').value = trip.name;
    document.getElementById('trip-start').value = trip.startDate;
    document.getElementById('trip-end').value = trip.endDate;
    document.getElementById('trip-rate').value = trip.exchangeRate;
    // 통화 설정
    const currencySelect = document.getElementById('trip-currency');
    if (currencySelect) {
      currencySelect.value = trip.currency || 'JPY';
    }
    this.openModal('settings-modal');
  },

  saveSettings(e) {
    e.preventDefault();
    const currentTrip = Storage.getTrip();
    const currencySelect = document.getElementById('trip-currency');
    const currency = currencySelect ? currencySelect.value : (currentTrip.currency || 'JPY');
    const symbols = { JPY: '¥', HKD: 'HK$', USD: '$', EUR: '€', CNY: '¥', THB: '฿', TWD: 'NT$', VND: '₫', SGD: 'S$' };

    const trip = {
      id: currentTrip.id,
      name: document.getElementById('trip-name').value,
      startDate: document.getElementById('trip-start').value,
      endDate: document.getElementById('trip-end').value,
      exchangeRate: parseFloat(document.getElementById('trip-rate').value),
      currency: currency,
      currencySymbol: symbols[currency] || currency
    };
    Storage.saveTrip(trip);
    document.querySelector('.app-title').textContent = 'TravelMate';
    this.closeModal();
    this.renderTripSelector();
    this.switchTab(this.currentTab);
  },

  // 데이터 내보내기
  exportData() {
    const data = Storage.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'travel-data.json';
    a.click();
    URL.revokeObjectURL(url);
  },

  // 데이터 가져오기
  importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (Storage.importData(ev.target.result)) {
          alert('데이터를 성공적으로 가져왔습니다!');
          this.closeModal();
          this.switchTab(this.currentTab);
        } else {
          alert('데이터 형식이 올바르지 않습니다.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  },

  // 날짜 포맷 헬퍼
  formatDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = days[date.getDay()];
    return `${month}/${day}(${dayOfWeek})`;
  },

  formatDateShort(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    return `${date.getMonth() + 1}/${date.getDate()}`;
  },

  // 통화 심볼 헬퍼
  getCurrencySymbol() {
    const trip = Storage.getTrip();
    return trip.currencySymbol || '¥';
  },

  getCurrencyCode() {
    const trip = Storage.getTrip();
    return trip.currency || 'JPY';
  },

  // 카테고리 이름 헬퍼
  categoryNames: {
    sightseeing: '관광',
    food: '식사',
    shopping: '쇼핑',
    cafe: '카페',
    accommodation: '숙소',
    transport: '이동',
    event: '행사',
    other: '기타'
  },

  expenseCategoryNames: {
    food: '식비',
    transport: '교통',
    accommodation: '숙박',
    cafe: '카페',
    sightseeing: '관광',
    shopping: '쇼핑',
    event: '행사',
    other: '기타'
  },

  categoryIcons: {
    food: '🍽️',
    transport: '🚃',
    accommodation: '🏨',
    sightseeing: '🏯',
    shopping: '🛍️',
    cafe: '☕',
    event: '🎖️',
    other: '📌'
  },

  // 숫자 포맷 (천 단위 콤마)
  formatNumber(num) {
    return Number(num).toLocaleString();
  }
};

// DOM 로드 후 초기화
document.addEventListener('DOMContentLoaded', () => App.init());
