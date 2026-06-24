const API = 'http://localhost:3000/eventos';

const CORES = {
  show: '#e74c3c',
  workshop: '#3498db',
  palestra: '#2ecc71',
  conferencia: '#9b59b6'
};

let todosEventos = [];

// ── Utilitários ──────────────────────────────────────────────
function formatarData(str) {
  const [y, m, d] = str.split('-');
  return `${d}/${m}/${y}`;
}

function mostrarToast(msg, tipo = 'ok') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = `toast toast-${tipo}`;
  setTimeout(() => t.classList.add('hidden'), 2800);
}

// ── Leitura ──────────────────────────────────────────────────
async function carregarEventos() {
  const res = await fetch(API);
  todosEventos = await res.json();
  renderLista(todosEventos);
}

function renderLista(eventos) {
  const container = document.getElementById('lista-eventos');
  if (!eventos.length) {
    container.innerHTML = '<p class="vazio">Nenhum evento encontrado.</p>';
    return;
  }
  container.innerHTML = eventos.map(e => `
    <div class="evento-item">
      <div class="evento-item-info">
        <span class="tipo-badge badge-${e.tipo}">${e.tipo}</span>
        <strong>${e.nome}</strong>
        <span>📍 ${e.local}, ${e.cidade}</span>
        <span>📅 ${formatarData(e.data)}</span>
      </div>
      <div class="evento-item-acoes">
        <button class="btn-editar" onclick="preencherFormulario('${e.id}')">✏️ Editar</button>
        <button class="btn-excluir" onclick="excluirEvento('${e.id}')">🗑️ Excluir</button>
      </div>
    </div>
  `).join('');
}

// ── Filtro de busca ──────────────────────────────────────────
document.getElementById('busca').addEventListener('input', e => {
  const q = e.target.value.toLowerCase();
  const filtrados = todosEventos.filter(ev =>
    ev.nome.toLowerCase().includes(q) || ev.cidade.toLowerCase().includes(q)
  );
  renderLista(filtrados);
});

// ── Criação / Atualização ────────────────────────────────────
document.getElementById('form-evento').addEventListener('submit', async e => {
  e.preventDefault();
  const id = document.getElementById('evento-id').value;
  const payload = {
    nome:      document.getElementById('evento-nome').value.trim(),
    tipo:      document.getElementById('evento-tipo').value,
    data:      document.getElementById('evento-data').value,
    cidade:    document.getElementById('evento-cidade').value.trim(),
    local:     document.getElementById('evento-local').value.trim(),
    lat:       parseFloat(document.getElementById('evento-lat').value),
    lng:       parseFloat(document.getElementById('evento-lng').value),
    descricao: document.getElementById('evento-descricao').value.trim()
  };

  if (id) {
    await fetch(`${API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...payload })
    });
    mostrarToast('✅ Evento atualizado com sucesso!');
  } else {
    await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    mostrarToast('✅ Evento cadastrado com sucesso!');
  }

  limparFormulario();
  carregarEventos();
});

// ── Edição ───────────────────────────────────────────────────
function preencherFormulario(id) {
  const e = todosEventos.find(ev => ev.id === id);
  if (!e) return;
  document.getElementById('evento-id').value        = e.id;
  document.getElementById('evento-nome').value      = e.nome;
  document.getElementById('evento-tipo').value      = e.tipo;
  document.getElementById('evento-data').value      = e.data;
  document.getElementById('evento-cidade').value    = e.cidade;
  document.getElementById('evento-local').value     = e.local;
  document.getElementById('evento-lat').value       = e.lat;
  document.getElementById('evento-lng').value       = e.lng;
  document.getElementById('evento-descricao').value = e.descricao || '';
  document.getElementById('form-titulo').textContent = '✏️ Editar Evento';
  document.getElementById('btn-salvar').textContent  = '💾 Atualizar';
  document.getElementById('btn-cancelar').classList.remove('hidden');
  document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
}

// ── Exclusão ─────────────────────────────────────────────────
async function excluirEvento(id) {
  if (!confirm('Deseja excluir este evento?')) return;
  await fetch(`${API}/${id}`, { method: 'DELETE' });
  mostrarToast('🗑️ Evento excluído.', 'erro');
  carregarEventos();
}

// ── Cancelar edição ──────────────────────────────────────────
document.getElementById('btn-cancelar').addEventListener('click', limparFormulario);

function limparFormulario() {
  document.getElementById('form-evento').reset();
  document.getElementById('evento-id').value         = '';
  document.getElementById('form-titulo').textContent  = '➕ Novo Evento';
  document.getElementById('btn-salvar').textContent   = '💾 Salvar';
  document.getElementById('btn-cancelar').classList.add('hidden');
}

// ── Init ─────────────────────────────────────────────────────
carregarEventos();
