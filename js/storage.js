// storage.js - localStorage 데이터 관리 모듈 (멀티트립 지원)

const Storage = {
  KEYS: {
    TRIPS: 'travel_trips',
    CURRENT: 'travel_current_trip'
  },

  // 현재 트립 ID 기반 동적 키
  _placesKey() { return 'travel_places_' + this.getCurrentTripId(); },
  _expensesKey() { return 'travel_expenses_' + this.getCurrentTripId(); },

  // --- 멀티트립 관리 ---
  getTrips() {
    const data = localStorage.getItem(this.KEYS.TRIPS);
    if (data) return JSON.parse(data);
    // 마이그레이션: 기존 단일 트립 데이터가 있으면 변환
    const oldTrip = localStorage.getItem('travel_trip');
    if (oldTrip) {
      const trip = JSON.parse(oldTrip);
      const trips = [{ id: 'tokyo', ...trip }];
      this.saveTrips(trips);
      // 기존 places/expenses를 새 키로 마이그레이션
      const oldPlaces = localStorage.getItem('travel_places');
      const oldExpenses = localStorage.getItem('travel_expenses');
      if (oldPlaces) localStorage.setItem('travel_places_tokyo', oldPlaces);
      if (oldExpenses) localStorage.setItem('travel_expenses_tokyo', oldExpenses);
      localStorage.setItem(this.KEYS.CURRENT, 'tokyo');
      // 기존 키 정리
      localStorage.removeItem('travel_trip');
      localStorage.removeItem('travel_places');
      localStorage.removeItem('travel_expenses');
      return trips;
    }
    // 초기 기본값
    const defaultTrips = [{
      id: 'tokyo',
      name: '도쿄 여행 2026',
      startDate: '2026-03-21',
      endDate: '2026-03-25',
      currency: 'JPY',
      currencySymbol: '¥',
      exchangeRate: 9.2
    }];
    this.saveTrips(defaultTrips);
    localStorage.setItem(this.KEYS.CURRENT, 'tokyo');
    return defaultTrips;
  },

  saveTrips(trips) {
    localStorage.setItem(this.KEYS.TRIPS, JSON.stringify(trips));
  },

  getCurrentTripId() {
    return localStorage.getItem(this.KEYS.CURRENT) || 'tokyo';
  },

  setCurrentTrip(tripId) {
    localStorage.setItem(this.KEYS.CURRENT, tripId);
  },

  // 현재 선택된 트립 정보
  getTrip() {
    const trips = this.getTrips();
    const currentId = this.getCurrentTripId();
    const trip = trips.find(t => t.id === currentId);
    return trip || trips[0];
  },

  saveTrip(tripData) {
    const trips = this.getTrips();
    const idx = trips.findIndex(t => t.id === tripData.id);
    if (idx !== -1) {
      trips[idx] = tripData;
    } else {
      trips.push(tripData);
    }
    this.saveTrips(trips);
  },

  addTrip(trip) {
    const trips = this.getTrips();
    trips.push(trip);
    this.saveTrips(trips);
  },

  deleteTrip(tripId) {
    let trips = this.getTrips();
    trips = trips.filter(t => t.id !== tripId);
    this.saveTrips(trips);
    localStorage.removeItem('travel_places_' + tripId);
    localStorage.removeItem('travel_expenses_' + tripId);
    if (this.getCurrentTripId() === tripId && trips.length > 0) {
      this.setCurrentTrip(trips[0].id);
    }
  },

  // UUID 생성
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  },

  // --- Places ---
  getPlaces() {
    const data = localStorage.getItem(this._placesKey());
    return data ? JSON.parse(data) : [];
  },

  savePlaces(places) {
    localStorage.setItem(this._placesKey(), JSON.stringify(places));
  },

  addPlace(place) {
    const places = this.getPlaces();
    place.id = this.generateId();
    place.order = places.filter(p => p.date === place.date).length + 1;
    places.push(place);
    this.savePlaces(places);
    return place;
  },

  updatePlace(id, updates) {
    const places = this.getPlaces();
    const idx = places.findIndex(p => p.id === id);
    if (idx !== -1) {
      places[idx] = { ...places[idx], ...updates };
      this.savePlaces(places);
    }
    return places[idx];
  },

  deletePlace(id) {
    const places = this.getPlaces().filter(p => p.id !== id);
    this.savePlaces(places);
  },

  getPlacesByDate(date) {
    return this.getPlaces()
      .filter(p => p.date === date)
      .sort((a, b) => a.order - b.order);
  },

  // --- Expenses ---
  getExpenses() {
    const data = localStorage.getItem(this._expensesKey());
    return data ? JSON.parse(data) : [];
  },

  saveExpenses(expenses) {
    localStorage.setItem(this._expensesKey(), JSON.stringify(expenses));
  },

  addExpense(expense) {
    const expenses = this.getExpenses();
    expense.id = this.generateId();
    expenses.push(expense);
    this.saveExpenses(expenses);
    return expense;
  },

  updateExpense(id, updates) {
    const expenses = this.getExpenses();
    const idx = expenses.findIndex(e => e.id === id);
    if (idx !== -1) {
      expenses[idx] = { ...expenses[idx], ...updates };
      this.saveExpenses(expenses);
    }
    return expenses[idx];
  },

  deleteExpense(id) {
    const expenses = this.getExpenses().filter(e => e.id !== id);
    this.saveExpenses(expenses);
  },

  getExpensesByDate(date) {
    return this.getExpenses().filter(e => e.date === date);
  },

  // --- 통계 ---
  getTotalExpense() {
    return this.getExpenses().reduce((sum, e) => sum + Number(e.amount), 0);
  },

  getExpensesByCategory() {
    const expenses = this.getExpenses();
    const result = {};
    expenses.forEach(e => {
      if (!result[e.category]) result[e.category] = 0;
      result[e.category] += Number(e.amount);
    });
    return result;
  },

  getExpensesByDateSummary() {
    const expenses = this.getExpenses();
    const result = {};
    expenses.forEach(e => {
      if (!result[e.date]) result[e.date] = 0;
      result[e.date] += Number(e.amount);
    });
    return result;
  },

  // --- 여행 날짜 목록 ---
  getTripDates() {
    const trip = this.getTrip();
    const dates = [];
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  },

  // --- 데이터 내보내기/가져오기 ---
  exportData() {
    return JSON.stringify({
      trip: this.getTrip(),
      places: this.getPlaces(),
      expenses: this.getExpenses()
    }, null, 2);
  },

  importData(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data.trip) this.saveTrip(data.trip);
      if (data.places) this.savePlaces(data.places);
      if (data.expenses) this.saveExpenses(data.expenses);
      return true;
    } catch (e) {
      console.error('데이터 가져오기 실패:', e);
      return false;
    }
  },

  clearAll() {
    const trips = this.getTrips();
    trips.forEach(t => {
      localStorage.removeItem('travel_places_' + t.id);
      localStorage.removeItem('travel_expenses_' + t.id);
    });
    localStorage.removeItem(this.KEYS.TRIPS);
    localStorage.removeItem(this.KEYS.CURRENT);
  }
};
