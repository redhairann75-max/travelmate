// map.js - Leaflet 지도 모듈

const TravelMap = {
  map: null,
  markers: [],
  initialized: false,

  // 카테고리별 마커 색상
  markerColors: {
    sightseeing: '#E74C3C',
    food: '#F39C12',
    shopping: '#9B59B6',
    cafe: '#1ABC9C',
    accommodation: '#3498DB',
    transport: '#95A5A6'
  },

  init() {
    if (!this.initialized) {
      // 지도 초기 생성
      this.map = L.map('map-container', {
        zoomControl: true,
        attributionControl: true
      }).setView([35.6762, 139.6503], 12); // 도쿄 중심

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(this.map);

      this.initialized = true;
    }

    // 지도 크기 재계산 (탭 전환 후 필수)
    setTimeout(() => {
      this.map.invalidateSize();
    }, 200);

    this.populateDateFilter();
    this.renderMarkers();
  },

  populateDateFilter() {
    const select = document.getElementById('map-date-filter');
    const dates = Storage.getTripDates();

    let options = '<option value="all">전체 날짜</option>';
    options += dates.map((date, i) =>
      `<option value="${date}">DAY ${i + 1} - ${App.formatDate(date)}</option>`
    ).join('');
    select.innerHTML = options;
  },

  filterByDate(date) {
    this.renderMarkers(date);
  },

  renderMarkers(filterDate) {
    // 기존 마커 제거
    this.markers.forEach(m => this.map.removeLayer(m));
    this.markers = [];

    let places = Storage.getPlaces().filter(p => p.lat && p.lng);

    if (filterDate && filterDate !== 'all') {
      places = places.filter(p => p.date === filterDate);
    }

    if (places.length === 0) return;

    const bounds = [];

    // 날짜별로 그룹핑하여 연결선 그리기
    const dateGroups = {};
    places.forEach(p => {
      if (!dateGroups[p.date]) dateGroups[p.date] = [];
      dateGroups[p.date].push(p);
    });

    // 날짜별 색상
    const dates = Storage.getTripDates();
    const lineColors = ['#E74C3C', '#3498DB', '#27AE60', '#F39C12', '#9B59B6', '#1ABC9C', '#E67E22'];

    Object.keys(dateGroups).sort().forEach((date, dateIdx) => {
      const dayPlaces = dateGroups[date].sort((a, b) => {
        if (!a.time) return 1;
        if (!b.time) return -1;
        return a.time.localeCompare(b.time);
      });

      // 연결선 그리기
      if (dayPlaces.length > 1) {
        const linePoints = dayPlaces.map(p => [p.lat, p.lng]);
        const polyline = L.polyline(linePoints, {
          color: lineColors[dateIdx % lineColors.length],
          weight: 3,
          opacity: 0.6,
          dashArray: '8, 8'
        }).addTo(this.map);
        this.markers.push(polyline);
      }

      // 마커 표시
      dayPlaces.forEach((place, i) => {
        const color = this.markerColors[place.category] || '#95A5A6';
        const dayNum = dates.indexOf(place.date) + 1;

        // 커스텀 원형 마커
        const marker = L.circleMarker([place.lat, place.lng], {
          radius: 10,
          fillColor: color,
          color: '#fff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.9
        }).addTo(this.map);

        // 팝업
        const categoryName = App.categoryNames[place.category] || '';
        const popupContent = `
          <div class="popup-title">${place.name}</div>
          <div class="popup-meta">
            DAY ${dayNum} ${place.time ? '· ' + place.time : ''} · ${categoryName}
          </div>
          ${place.memo ? `<div class="popup-meta" style="margin-top:4px;font-style:italic">${place.memo}</div>` : ''}
        `;
        marker.bindPopup(popupContent);

        // 순서 번호 표시
        const numberIcon = L.divIcon({
          className: 'marker-number',
          html: `<div style="
            background:${color};
            color:white;
            width:24px;
            height:24px;
            border-radius:50%;
            display:flex;
            align-items:center;
            justify-content:center;
            font-size:12px;
            font-weight:bold;
            border:2px solid white;
            box-shadow:0 2px 4px rgba(0,0,0,0.3);
          ">${i + 1}</div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const numberMarker = L.marker([place.lat, place.lng], { icon: numberIcon }).addTo(this.map);
        numberMarker.bindPopup(popupContent);

        this.markers.push(marker);
        this.markers.push(numberMarker);
        bounds.push([place.lat, place.lng]);
      });
    });

    // 모든 마커가 보이도록 지도 범위 조정
    if (bounds.length > 0) {
      this.map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    }
  }
};
