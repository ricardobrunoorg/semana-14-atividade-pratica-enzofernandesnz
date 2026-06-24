const API = 'http://localhost:3000/eventos';

const CORES = {
  show:        '#e74c3c',
  workshop:    '#3498db',
  palestra:    '#2ecc71',
  conferencia: '#9b59b6'
};

const MESES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

function formatarData(str) {
  const [y, m, d] = str.split('-');
  return `${d}/${m}/${y}`;
}

// ── Cards de resumo ──────────────────────────────────────────
function renderCards(eventos) {
  const contagem = {};
  eventos.forEach(e => { contagem[e.tipo] = (contagem[e.tipo] || 0) + 1; });

  const container = document.getElementById('resumo');
  container.innerHTML = `
    <div class="card">
      <h3>Total</h3>
      <div class="numero">${eventos.length}</div>
      <div class="label">eventos</div>
    </div>
    ${Object.entries(contagem).map(([tipo, qtd]) => `
      <div class="card card-tipo-${tipo}">
        <h3>${tipo}</h3>
        <div class="numero">${qtd}</div>
        <div class="label">evento${qtd > 1 ? 's' : ''}</div>
      </div>
    `).join('')}
  `;
}

// ── Calendário ───────────────────────────────────────────────
function renderCalendario(eventos) {
  const calendar = new FullCalendar.Calendar(document.getElementById('calendar'), {
    initialView: 'dayGridMonth',
    locale: 'pt-br',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,listMonth'
    },
    events: eventos.map(e => ({
      title: e.nome,
      start: e.data,
      classNames: [`fc-event-tipo-${e.tipo}`],
      extendedProps: e
    })),
    eventClick(info) { abrirModal(info.event.extendedProps); }
  });
  calendar.render();
}

// ── Gráficos ─────────────────────────────────────────────────
function renderGraficos(eventos) {
  const contagem = {};
  eventos.forEach(e => { contagem[e.tipo] = (contagem[e.tipo] || 0) + 1; });

  new Chart(document.getElementById('graficoPizza'), {
    type: 'doughnut',
    data: {
      labels: Object.keys(contagem).map(t => t.charAt(0).toUpperCase() + t.slice(1)),
      datasets: [{
        data: Object.values(contagem),
        backgroundColor: Object.keys(contagem).map(t => CORES[t] || '#999'),
        borderWidth: 0,
        hoverOffset: 10
      }]
    },
    options: {
      plugins: { legend: { labels: { color: '#eaeaea', font: { size: 13 } } } }
    }
  });

  const porMes = Array(12).fill(0);
  eventos.forEach(e => { porMes[new Date(e.data + 'T00:00:00').getMonth()]++; });
  const mesesCom = MESES.map((m, i) => ({ m, q: porMes[i] })).filter(x => x.q > 0);

  new Chart(document.getElementById('graficoBarra'), {
    type: 'bar',
    data: {
      labels: mesesCom.map(x => x.m),
      datasets: [{
        label: 'Eventos',
        data: mesesCom.map(x => x.q),
        backgroundColor: '#e94560cc',
        borderRadius: 6
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: '#a0a0b0' }, grid: { color: '#2a2a3e' } },
        y: { ticks: { color: '#a0a0b0', stepSize: 1 }, grid: { color: '#2a2a3e' } }
      }
    }
  });
}

// ── Mapa (Leaflet + OpenStreetMap — gratuito) ───────────────
function renderMapa(eventos) {
  const map = L.map('map').setView([-15, -50], 4);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  eventos.forEach(e => {
    const cor = CORES[e.tipo] || '#999';
    const marcador = L.circleMarker([e.lat, e.lng], {
      radius: 8,
      fillColor: cor,
      color: '#fff',
      weight: 2,
      fillOpacity: 0.9
    }).addTo(map);

    marcador.bindPopup(`
      <strong>${e.nome}</strong><br/>
      <small>${e.local} — ${e.cidade}</small><br/>
      <small>${formatarData(e.data)}</small>
    `);

    marcador.on('click', () => abrirModal(e));
  });
}

// ── Modal ────────────────────────────────────────────────────
function abrirModal(e) {
  document.getElementById('modal-body').innerHTML = `
    <span class="tipo-badge badge-${e.tipo}">${e.tipo}</span>
    <h2>${e.nome}</h2>
    <p>📍 <strong>${e.local}</strong> — ${e.cidade}</p>
    <p>📅 ${formatarData(e.data)}</p>
    <p style="margin-top:.8rem;color:#a0a0b0">${e.descricao || ''}</p>
  `;
  document.getElementById('modal').classList.remove('hidden');
}

document.getElementById('modal-fechar').addEventListener('click', () => {
  document.getElementById('modal').classList.add('hidden');
});
document.getElementById('modal').addEventListener('click', ev => {
  if (ev.target === ev.currentTarget) ev.currentTarget.classList.add('hidden');
});

// ── Init ─────────────────────────────────────────────────────
fetch(API)
  .then(r => r.json())
  .then(eventos => {
    renderCards(eventos);
    renderCalendario(eventos);
    renderGraficos(eventos);
    renderMapa(eventos);
  });
