// itinerary.js - 일정 관리 모듈

const Itinerary = {
  selectedDate: null,

  init() {
    const dates = Storage.getTripDates();
    if (dates.length > 0) {
      this.selectedDate = dates[0];
    }
    this.render();
  },

  render() {
    this.renderDateSelector();
    this.renderPlaces();
  },

  renderDateSelector() {
    const container = document.getElementById('itinerary-dates');
    const dates = Storage.getTripDates();
    const trip = Storage.getTrip();

    if (dates.length === 0) {
      container.innerHTML = '<p style="color:var(--text-light);font-size:13px;">설정에서 여행 날짜를 입력하세요</p>';
      return;
    }

    container.innerHTML = dates.map((date, i) => `
      <button class="date-chip ${date === this.selectedDate ? 'active' : ''}"
              onclick="Itinerary.selectDate('${date}')">
        DAY ${i + 1}
        <span class="day-label">${App.formatDate(date)}</span>
      </button>
    `).join('');
  },

  selectDate(date) {
    this.selectedDate = date;
    this.render();
  },

  renderPlaces() {
    const container = document.getElementById('place-list');

    if (!this.selectedDate) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📅</div>
          <p>설정에서 여행 기간을 설정하세요</p>
        </div>`;
      return;
    }

    const places = Storage.getPlacesByDate(this.selectedDate);

    if (places.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">✈️</div>
          <p>아직 일정이 없어요<br>"+ 장소 추가"를 눌러 일정을 만들어보세요</p>
        </div>`;
      return;
    }

    container.innerHTML = places.map(place => `
      <div class="place-card" data-id="${place.id}">
        <div class="place-time">${place.time || '--:--'}</div>
        <div class="place-info">
          <div class="place-name">${this.escapeHtml(place.name)}</div>
          <div class="place-meta">
            <span class="category-badge ${place.category}">${App.categoryNames[place.category] || place.category}</span>
            ${place.lat ? ' 📍 위치 등록됨' : ''}
          </div>
          ${place.memo ? `<div class="place-memo">${this.escapeHtml(place.memo)}</div>` : ''}
        </div>
        <div class="place-actions">
          <button onclick="Itinerary.editPlace('${place.id}')" title="수정">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="btn-delete" onclick="Itinerary.deletePlace('${place.id}')" title="삭제">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </div>
    `).join('');
  },

  openAddForm() {
    document.getElementById('place-modal-title').textContent = '장소 추가';
    document.getElementById('place-form').reset();
    document.getElementById('place-id').value = '';

    // 날짜 옵션 채우기
    this.populateDateSelect('place-date');

    // 현재 선택된 날짜 설정
    if (this.selectedDate) {
      document.getElementById('place-date').value = this.selectedDate;
    }

    App.openModal('place-modal');
  },

  editPlace(id) {
    const places = Storage.getPlaces();
    const place = places.find(p => p.id === id);
    if (!place) return;

    document.getElementById('place-modal-title').textContent = '장소 수정';
    document.getElementById('place-id').value = place.id;

    this.populateDateSelect('place-date');

    document.getElementById('place-date').value = place.date;
    document.getElementById('place-name').value = place.name;
    document.getElementById('place-time').value = place.time || '';
    document.getElementById('place-category').value = place.category;
    document.getElementById('place-memo').value = place.memo || '';
    document.getElementById('place-lat').value = place.lat || '';
    document.getElementById('place-lng').value = place.lng || '';

    App.openModal('place-modal');
  },

  savePlace(e) {
    e.preventDefault();

    const id = document.getElementById('place-id').value;
    const placeData = {
      date: document.getElementById('place-date').value,
      name: document.getElementById('place-name').value.trim(),
      time: document.getElementById('place-time').value,
      category: document.getElementById('place-category').value,
      memo: document.getElementById('place-memo').value.trim(),
      lat: parseFloat(document.getElementById('place-lat').value) || null,
      lng: parseFloat(document.getElementById('place-lng').value) || null
    };

    if (id) {
      Storage.updatePlace(id, placeData);
    } else {
      Storage.addPlace(placeData);
    }

    App.closeModal();
    this.selectedDate = placeData.date;
    this.render();
  },

  deletePlace(id) {
    if (confirm('이 장소를 삭제하시겠습니까?')) {
      Storage.deletePlace(id);
      this.render();
    }
  },

  // 장소 검색 (Nominatim 무료 API)
  async searchLocation() {
    const name = document.getElementById('place-name').value.trim();
    if (!name) {
      alert('먼저 장소명을 입력하세요.');
      return;
    }

    const query = name + ', Tokyo, Japan';
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
        { headers: { 'Accept-Language': 'ko' } }
      );
      const results = await res.json();

      if (results.length > 0) {
        document.getElementById('place-lat').value = parseFloat(results[0].lat).toFixed(6);
        document.getElementById('place-lng').value = parseFloat(results[0].lon).toFixed(6);
        alert(`위치를 찾았습니다: ${results[0].display_name.split(',')[0]}`);
      } else {
        alert('위치를 찾을 수 없습니다. 직접 위도/경도를 입력하거나 장소명을 변경해보세요.');
      }
    } catch (err) {
      alert('검색 중 오류가 발생했습니다. 인터넷 연결을 확인하세요.');
    }
  },

  // 날짜 select 채우기
  populateDateSelect(selectId) {
    const select = document.getElementById(selectId);
    const dates = Storage.getTripDates();
    select.innerHTML = dates.map((date, i) =>
      `<option value="${date}">DAY ${i + 1} - ${App.formatDate(date)}</option>`
    ).join('');
  },

  // XSS 방지
  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
};
