// expenses.js - 경비 관리 모듈

const Expenses = {
  selectedDate: 'all',

  init() {
    this.render();
  },

  render() {
    this.renderSummaryBar();
    this.renderDateSelector();
    this.renderExpenses();
  },

  renderSummaryBar() {
    const container = document.getElementById('expense-summary-bar');
    const trip = Storage.getTrip();
    const sym = App.getCurrencySymbol();
    const totalForeign = Storage.getTotalExpense();
    const totalKRW = Math.round(totalForeign * trip.exchangeRate);

    container.innerHTML = `
      <div>
        <div class="expense-total-label">총 경비</div>
        <div class="expense-total-amount">${sym}${App.formatNumber(totalForeign)}</div>
      </div>
      <div style="text-align:right">
        <div class="expense-total-krw">≈ ₩${App.formatNumber(totalKRW)}</div>
        <div class="expense-total-label">1${sym} = ${trip.exchangeRate}원</div>
      </div>
    `;
  },

  renderDateSelector() {
    const container = document.getElementById('expense-dates');
    const dates = Storage.getTripDates();

    let chips = `<button class="date-chip ${this.selectedDate === 'all' ? 'active' : ''}"
                         onclick="Expenses.selectDate('all')">전체</button>`;

    chips += dates.map((date, i) => `
      <button class="date-chip ${date === this.selectedDate ? 'active' : ''}"
              onclick="Expenses.selectDate('${date}')">
        DAY ${i + 1}
        <span class="day-label">${App.formatDate(date)}</span>
      </button>
    `).join('');

    container.innerHTML = chips;
  },

  selectDate(date) {
    this.selectedDate = date;
    this.render();
  },

  renderExpenses() {
    const container = document.getElementById('expense-list');
    const trip = Storage.getTrip();
    let expenses;

    if (this.selectedDate === 'all') {
      expenses = Storage.getExpenses();
    } else {
      expenses = Storage.getExpensesByDate(this.selectedDate);
    }

    if (expenses.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">💴</div>
          <p>아직 지출이 없어요<br>"+ 지출 추가"를 눌러 기록을 시작하세요</p>
        </div>`;
      return;
    }

    // 날짜별 그룹핑 (전체 보기일 때)
    if (this.selectedDate === 'all') {
      const grouped = {};
      expenses.forEach(exp => {
        if (!grouped[exp.date]) grouped[exp.date] = [];
        grouped[exp.date].push(exp);
      });

      let html = '';
      const dates = Object.keys(grouped).sort();
      dates.forEach(date => {
        const dayTotal = grouped[date].reduce((sum, e) => sum + Number(e.amount), 0);
        html += `<div class="date-group-header">${App.formatDate(date)} — ${App.getCurrencySymbol()}${App.formatNumber(dayTotal)}</div>`;
        html += grouped[date].map(exp => this.renderExpenseCard(exp, trip)).join('');
      });
      container.innerHTML = html;
    } else {
      container.innerHTML = expenses.map(exp => this.renderExpenseCard(exp, trip)).join('');
    }
  },

  renderExpenseCard(expense, trip) {
    const icon = App.categoryIcons[expense.category] || '📌';
    const categoryName = App.expenseCategoryNames[expense.category] || expense.category;
    const krwAmount = Math.round(Number(expense.amount) * trip.exchangeRate);

    return `
      <div class="expense-card" data-id="${expense.id}">
        <div class="expense-icon ${expense.category}">${icon}</div>
        <div class="expense-info">
          <div class="expense-desc">${this.escapeHtml(expense.description || categoryName)}</div>
          <div class="expense-category-label">${categoryName}</div>
        </div>
        <div class="expense-amount">
          <div class="expense-jpy">${App.getCurrencySymbol()}${App.formatNumber(expense.amount)}</div>
          <div class="expense-krw">₩${App.formatNumber(krwAmount)}</div>
        </div>
        <div class="expense-actions">
          <button onclick="Expenses.editExpense('${expense.id}')" title="수정">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="btn-delete" onclick="Expenses.deleteExpense('${expense.id}')" title="삭제">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </div>
    `;
  },

  openAddForm() {
    document.getElementById('expense-modal-title').textContent = '지출 추가';
    document.getElementById('expense-form').reset();
    document.getElementById('expense-id').value = '';

    this.populateDateSelect();
    this.populatePlaceSelect();

    // 현재 선택된 날짜 설정
    if (this.selectedDate !== 'all') {
      document.getElementById('expense-date').value = this.selectedDate;
    }

    App.openModal('expense-modal');
  },

  editExpense(id) {
    const expenses = Storage.getExpenses();
    const expense = expenses.find(e => e.id === id);
    if (!expense) return;

    document.getElementById('expense-modal-title').textContent = '지출 수정';
    document.getElementById('expense-id').value = expense.id;

    this.populateDateSelect();
    this.populatePlaceSelect();

    document.getElementById('expense-date').value = expense.date;
    document.getElementById('expense-amount').value = expense.amount;
    document.getElementById('expense-category').value = expense.category;
    document.getElementById('expense-description').value = expense.description || '';
    document.getElementById('expense-place').value = expense.placeId || '';

    App.openModal('expense-modal');
  },

  saveExpense(e) {
    e.preventDefault();

    const id = document.getElementById('expense-id').value;
    const expenseData = {
      date: document.getElementById('expense-date').value,
      amount: parseInt(document.getElementById('expense-amount').value),
      category: document.getElementById('expense-category').value,
      description: document.getElementById('expense-description').value.trim(),
      placeId: document.getElementById('expense-place').value || null
    };

    if (id) {
      Storage.updateExpense(id, expenseData);
    } else {
      Storage.addExpense(expenseData);
    }

    App.closeModal();
    this.render();
  },

  deleteExpense(id) {
    if (confirm('이 지출을 삭제하시겠습니까?')) {
      Storage.deleteExpense(id);
      this.render();
    }
  },

  populateDateSelect() {
    const select = document.getElementById('expense-date');
    const dates = Storage.getTripDates();
    select.innerHTML = dates.map((date, i) =>
      `<option value="${date}">DAY ${i + 1} - ${App.formatDate(date)}</option>`
    ).join('');
  },

  populatePlaceSelect() {
    const select = document.getElementById('expense-place');
    const places = Storage.getPlaces();
    let options = '<option value="">없음</option>';
    options += places.map(p =>
      `<option value="${p.id}">${this.escapeHtml(p.name)} (${App.formatDate(p.date)})</option>`
    ).join('');
    select.innerHTML = options;
  },

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
};
