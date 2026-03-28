// summary.js - 요약/통계 모듈

const Summary = {
  init() {
    // 요약 탭 전환 시 render 호출됨
  },

  render() {
    const container = document.getElementById('summary-content');
    const trip = Storage.getTrip();
    const places = Storage.getPlaces();
    const expenses = Storage.getExpenses();
    const sym = App.getCurrencySymbol();
    const code = App.getCurrencyCode();
    const totalForeign = Storage.getTotalExpense();
    const totalKRW = Math.round(totalForeign * trip.exchangeRate);
    const dates = Storage.getTripDates();
    const byCategory = Storage.getExpensesByCategory();
    const byDate = Storage.getExpensesByDateSummary();

    // 여행 개요
    let html = `
      <div class="summary-card">
        <h3>${this.escapeHtml(trip.name)}</h3>
        <div class="summary-overview">
          <div class="summary-stat">
            <div class="stat-value">${dates.length}</div>
            <div class="stat-label">일</div>
          </div>
          <div class="summary-stat">
            <div class="stat-value">${places.length}</div>
            <div class="stat-label">장소</div>
          </div>
          <div class="summary-stat">
            <div class="stat-value">${sym}${App.formatNumber(totalForeign)}</div>
            <div class="stat-label">총 경비 (${code})</div>
          </div>
          <div class="summary-stat">
            <div class="stat-value">₩${App.formatNumber(totalKRW)}</div>
            <div class="stat-label">총 경비 (KRW)</div>
          </div>
        </div>
      </div>
    `;

    // 카테고리별 경비
    if (Object.keys(byCategory).length > 0) {
      const maxAmount = Math.max(...Object.values(byCategory));

      html += `
        <div class="summary-card">
          <h3>카테고리별 경비</h3>
          <div class="bar-chart">
            ${Object.entries(byCategory)
              .sort((a, b) => b[1] - a[1])
              .map(([cat, amount]) => {
                const pct = maxAmount > 0 ? (amount / maxAmount * 100) : 0;
                const color = this.getCategoryColor(cat);
                const name = App.expenseCategoryNames[cat] || cat;
                return `
                  <div class="bar-row">
                    <div class="bar-label">${name}</div>
                    <div class="bar-track">
                      <div class="bar-fill" style="width:${pct}%;background:${color}"></div>
                    </div>
                    <div class="bar-value">${sym}${App.formatNumber(amount)}</div>
                  </div>
                `;
              }).join('')}
          </div>
        </div>
      `;
    }

    // 날짜별 경비
    if (dates.length > 0 && Object.keys(byDate).length > 0) {
      const maxDayAmount = Math.max(...Object.values(byDate), 1);

      html += `
        <div class="summary-card">
          <h3>날짜별 경비</h3>
          <div class="bar-chart">
            ${dates.map((date, i) => {
              const amount = byDate[date] || 0;
              const pct = maxDayAmount > 0 ? (amount / maxDayAmount * 100) : 0;
              return `
                <div class="bar-row">
                  <div class="bar-label">D${i + 1}</div>
                  <div class="bar-track">
                    <div class="bar-fill" style="width:${pct}%;background:var(--primary)"></div>
                  </div>
                  <div class="bar-value">${sym}${App.formatNumber(amount)}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }

    // 일평균 경비
    if (expenses.length > 0 && dates.length > 0) {
      const avgForeign = Math.round(totalForeign / dates.length);
      const avgKRW = Math.round(avgForeign * trip.exchangeRate);

      html += `
        <div class="summary-card">
          <h3>평균 경비</h3>
          <div class="summary-overview">
            <div class="summary-stat">
              <div class="stat-value">${sym}${App.formatNumber(avgForeign)}</div>
              <div class="stat-label">일 평균 (${code})</div>
            </div>
            <div class="summary-stat">
              <div class="stat-value">₩${App.formatNumber(avgKRW)}</div>
              <div class="stat-label">일 평균 (KRW)</div>
            </div>
          </div>
        </div>
      `;
    }

    // 데이터 없을 때
    if (places.length === 0 && expenses.length === 0) {
      html += `
        <div class="empty-state">
          <div class="empty-icon">📊</div>
          <p>일정과 경비를 추가하면<br>여기서 요약을 확인할 수 있어요</p>
        </div>
      `;
    }

    container.innerHTML = html;
  },

  getCategoryColor(category) {
    const colors = {
      food: '#F39C12',
      transport: '#3498DB',
      accommodation: '#27AE60',
      sightseeing: '#E74C3C',
      shopping: '#9B59B6',
      cafe: '#1ABC9C',
      event: '#E67E22',
      other: '#95A5A6'
    };
    return colors[category] || '#95A5A6';
  },

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
};
