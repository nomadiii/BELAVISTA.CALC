// ============================================================================
// SISTEMA DE CONTROLE DE PESAGEM - BELA VISTA AGRONEGÓCIOS
// ============================================================================

// ============================================================================
// CONSTANTES E CONFIGURAÇÕES
// ============================================================================
const STORAGE_KEY = 'bv_pesagens_v1';
let weightsList = [];

// ============================================================================
// ESTADO DA APLICAÇÃO
// ============================================================================
let records = [];

// ============================================================================
// UTILITÁRIOS
// ============================================================================
const $ = id => document.getElementById(id);

const money = n => Number(n || 0).toLocaleString('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

const fmt = n => Number(n || 0).toLocaleString('pt-BR', {
  maximumFractionDigits: 2
});

const dateNow = () => new Date().toLocaleDateString('en-CA');

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}[c]));

// ============================================================================
// TOAST NOTIFICATIONS
// ============================================================================
function toast(message, type = 'info') {
  const toastEl = $('toast');
  toastEl.textContent = message;
  toastEl.style.display = 'block';
  toastEl.style.background = type === 'error' ? 'var(--error)' :
                            type === 'success' ? 'var(--success)' :
                            'var(--ink)';
  setTimeout(() => {
    toastEl.style.display = 'none';
  }, 2600);
}

// ============================================================================
// NAVEGAÇÃO ENTRE ABAS
// ============================================================================
function showTab(tab) {
  document.querySelectorAll('[data-tab]').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === tab);
  });

  ['dashboard', 'new', 'history'].forEach(x => {
    $(x).classList.toggle('hidden', x !== tab);
  });

  if (tab === 'dashboard') renderDashboard();
  if (tab === 'history') renderHistory();

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================================================
// PERSISTÊNCIA DE DADOS
// ============================================================================
function loadRecords() {
  try {
    records = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch (e) {
    console.error('Erro ao carregar registros:', e);
    records = [];
  }
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  renderDashboard();
}

// ============================================================================
// CALCULADORA DE PESOS
// ============================================================================
function addWeight() {
  const input = $('weightInput');
  const value = parseFloat(input.value);

  if (!Number.isFinite(value) || value <= 0) {
    toast('Digite um peso válido maior que 0', 'error');
    input.focus();
    return;
  }

  if (value > 2000) {
    toast('Peso não pode ser maior que 2000 kg', 'error');
    input.focus();
    return;
  }

  weightsList.push({
    n: weightsList.length + 1,
    kg: value
  });

  input.value = '';
  input.focus();
  renderWeightsList();
  calc();
}

function removeWeight(index) {
  weightsList.splice(index, 1);
  // Reenumerar
  weightsList = weightsList.map((w, i) => ({ ...w, n: i + 1 }));
  renderWeightsList();
  calc();
}

function renderWeightsList() {
  const container = $('weightsList');
  const price = parseFloat($('price').value) || 0;

  if (weightsList.length === 0) {
    container.innerHTML = '<div class="empty">Nenhum peso adicionado ainda.</div>';
    return;
  }

  const html = weightsList.map((w, index) => `
    <div class="weight-item">
      <div class="weight-info">
        <div class="weight-number">${w.n}</div>
        <div>
          <div class="weight-value">${fmt(w.kg)} kg</div>
          <div class="weight-price">${money(w.kg * price)}</div>
        </div>
      </div>
      <button class="weight-remove" onclick="removeWeight(${index})" title="Remover">×</button>
    </div>
  `).join('');

  container.innerHTML = html;
}

function weights() {
  return weightsList;
}

function calc() {
  const a = weights();
  const kg = a.reduce((s, x) => s + x.kg, 0);
  const price = parseFloat($('price').value) || 0;

  // Atualizar resumo
  $('sumHeads').textContent = a.length;
  $('sumKg').textContent = fmt(kg) + ' kg';
  $('sumAvg').textContent = fmt(a.length ? kg / a.length : 0) + ' kg';
  $('sumMoney').textContent = money(kg * price);
}

// ============================================================================
// VALIDAÇÕES
// ============================================================================
function validateForm() {
  const client = $('client').value.trim();
  const date = $('date').value;
  const price = parseFloat($('price').value) || 0;
  const weightsList = weights();

  const errors = [];

  if (!client) {
    errors.push({ field: 'client', message: 'Informe o nome do cliente' });
  } else if (client.length < 3) {
    errors.push({ field: 'client', message: 'Nome do cliente deve ter pelo menos 3 caracteres' });
  }

  if (!date) {
    errors.push({ field: 'date', message: 'Informe a data da pesagem' });
  }

  if (price < 0) {
    errors.push({ field: 'price', message: 'Preço não pode ser negativo' });
  }

  if (weightsList.length === 0) {
    errors.push({ field: 'weightInput', message: 'Adicione pelo menos um peso válido' });
  }

  return errors;
}

function showValidationErrors(errors) {
  // Limpar erros anteriores
  document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
  document.querySelectorAll('small.visible').forEach(el => el.classList.remove('visible'));

  errors.forEach(err => {
    if (err.field === 'weightInput') {
      toast(err.message, 'error');
      const input = $(err.field);
      if (input) {
        input.classList.add('error');
        setTimeout(() => input.classList.remove('error'), 2000);
      }
    } else {
      const input = $(err.field);
      if (input) {
        input.classList.add('error');
        const small = input.parentElement.querySelector('small');
        if (small) {
          small.textContent = err.message;
          small.classList.add('visible');
        }
      }
    }
  });
}

// ============================================================================
// LIMPEZA DO FORMULÁRIO
// ============================================================================
function clearForm() {
  if (!confirm('Limpar os dados do formulário?')) return;

  $('client').value = '';
  $('date').value = dateNow();
  $('cattle').value = 'Novilhas';
  $('price').value = '0';
  $('weightInput').value = '';

  weightsList = [];
  renderWeightsList();

  // Limpar erros de validação
  document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
  document.querySelectorAll('small.visible').forEach(el => el.classList.remove('visible'));

  calc();
}

// ============================================================================
// RELATÓRIO PRÉVIO
// ============================================================================
function showPreviewReport() {
  const errors = validateForm();
  if (errors.length > 0) {
    showValidationErrors(errors);
    return;
  }

  const client = $('client').value.trim();
  const date = $('date').value;
  const cattle = $('cattle').value;
  const price = parseFloat($('price').value) || 0;
  const weightsList = weights();

  const kg = weightsList.reduce((s, x) => s + x.kg, 0);
  const heads = weightsList.length;
  const avgKg = kg / heads;
  const total = kg * price;

  // Calcular distribuição de pesos
  const distribution = calculateWeightDistribution(weightsList);

  // Gerar HTML do relatório
  const reportHTML = generateReportHTML({
    client,
    date,
    cattle,
    price,
    heads,
    totalKg: kg,
    avgKg,
    total,
    weights: weightsList,
    distribution
  });

  // Criar e mostrar modal
  const modal = createModal('Relatório Prévio - Revisão antes de Salvar', reportHTML, [
    { text: 'Voltar e Editar', class: 'light', onClick: 'closeModal()' },
    { text: 'Confirmar e Salvar', class: '', onClick: 'confirmSave()' }
  ]);

  document.body.appendChild(modal);
}

function calculateWeightDistribution(weightsList) {
  const ranges = [
    { min: 0, max: 200, label: '0-200 kg' },
    { min: 200, max: 300, label: '200-300 kg' },
    { min: 300, max: 400, label: '300-400 kg' },
    { min: 400, max: 500, label: '400-500 kg' },
    { min: 500, max: 600, label: '500-600 kg' },
    { min: 600, max: Infinity, label: '600+ kg' }
  ];

  return ranges.map(range => {
    const count = weightsList.filter(w => w.kg >= range.min && w.kg < range.max).length;
    const percent = weightsList.length ? ((count / weightsList.length) * 100).toFixed(1) : 0;
    return { ...range, count, percent };
  });
}

function generateReportHTML(data) {
  const distHTML = data.distribution.map(d => `
    <div class="dist-item">
      <div class="range">${d.label}</div>
      <div class="count">${d.count}</div>
      <div class="percent">${d.percent}%</div>
    </div>
  `).join('');

  const weightsHTML = data.weights.map(w => `
    <tr>
      <td>${w.n}</td>
      <td>${fmt(w.kg)} kg</td>
      <td>${money(w.kg * data.price)}</td>
    </tr>
  `).join('');

  return `
    <div class="report-header">
      <h3>BELA VISTA AGRONEGÓCIOS</h3>
      <p>Relatório de pesagem - Revisão antes de salvar</p>
    </div>

    <div class="report-summary">
      <div>
        <label>Cliente</label>
        <div class="value" style="font-size: 16px">${esc(data.client)}</div>
      </div>
      <div>
        <label>Data</label>
        <div class="value" style="font-size: 16px">${esc(data.date)}</div>
      </div>
      <div>
        <label>Categoria</label>
        <div class="value" style="font-size: 16px">${esc(data.cattle)}</div>
      </div>
      <div>
        <label>Preço/kg</label>
        <div class="value" style="font-size: 16px">${money(data.price)}</div>
      </div>
    </div>

    <div class="report-summary">
      <div>
        <label>Cabeças</label>
        <div class="value">${data.heads}</div>
      </div>
      <div>
        <label>Peso Total</label>
        <div class="value">${fmt(data.totalKg)} kg</div>
      </div>
      <div>
        <label>Peso Médio</label>
        <div class="value">${fmt(data.avgKg)} kg</div>
      </div>
      <div>
        <label>Valor Total</label>
        <div class="value">${money(data.total)}</div>
      </div>
    </div>

    <div class="panel">
      <h3>Distribuição de Pesos</h3>
      <div class="distribution">
        ${distHTML}
      </div>
    </div>

    <div class="panel">
      <h3>Detalhamento por Animal</h3>
      <div class="tablewrap">
        <table>
          <thead>
            <tr>
              <th style="width: 64px">Nº</th>
              <th>Peso</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            ${weightsHTML}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function createModal(title, content, buttons) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.id = 'reportModal';

  const buttonsHTML = buttons.map(btn => `
    <button class="btn ${btn.class || ''}" onclick="${btn.onClick}">${btn.text}</button>
  `).join('');

  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h2>${title}</h2>
        <button class="modal-close" onclick="closeModal()">&times;</button>
      </div>
      <div class="modal-body">
        ${content}
      </div>
      <div class="modal-footer">
        ${buttonsHTML}
      </div>
    </div>
  `;

  return modal;
}

function closeModal() {
  const modal = $('reportModal');
  if (modal) {
    modal.remove();
  }
}

function confirmSave() {
  closeModal();
  saveRecord();
}

// ============================================================================
// SALVAR REGISTRO
// ============================================================================
function saveRecord() {
  const errors = validateForm();
  if (errors.length > 0) {
    showValidationErrors(errors);
    return;
  }

  const client = $('client').value.trim();
  const weightsList = weights();
  const kg = weightsList.reduce((s, x) => s + x.kg, 0);
  const price = parseFloat($('price').value) || 0;

  const rec = {
    id: Date.now().toString(),
    client,
    date: $('date').value || dateNow(),
    cattle: $('cattle').value,
    price,
    weights: weightsList,
    heads: weightsList.length,
    totalKg: kg,
    avgKg: kg / weightsList.length,
    total: kg * price,
    createdAt: new Date().toISOString()
  };

  records.unshift(rec);
  persist();
  toast('Pesagem salva com sucesso!', 'success');
  clearForm();
  showTab('history');
}

// ============================================================================
// DASHBOARD
// ============================================================================
function renderDashboard() {
  $('statRecords').textContent = records.length;
  $('statHeads').textContent = records.reduce((s, r) => s + r.heads, 0);
  $('statKg').textContent = fmt(records.reduce((s, r) => s + r.totalKg, 0)) + ' kg';
  $('statMoney').textContent = money(records.reduce((s, r) => s + r.total, 0));

  $('recent').innerHTML = records.length
    ? tableHTML(records.slice(0, 6), false)
    : '<div class="empty">Nenhuma pesagem registrada ainda.<br>Comece em "Nova pesagem".</div>';
}

// ============================================================================
// TABELAS
// ============================================================================
function tableHTML(list, actions = true) {
  return `
    <div class="tablewrap">
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Cliente</th>
            <th>Categoria</th>
            <th>Cabeças</th>
            <th>Peso total</th>
            <th>Média</th>
            <th>Valor total</th>
            ${actions ? '<th class="no-print">Ações</th>' : ''}
          </tr>
        </thead>
        <tbody>
          ${list.map(r => `
            <tr>
              <td>${esc(r.date)}</td>
              <td>${esc(r.client)}</td>
              <td>${esc(r.cattle)}</td>
              <td>${r.heads}</td>
              <td>${fmt(r.totalKg)} kg</td>
              <td>${fmt(r.avgKg)} kg</td>
              <td>${money(r.total)}</td>
              ${actions ? `
                <td class="no-print">
                  <button class="btn light" style="padding:6px 9px" onclick="viewRecord('${r.id}')">Ver</button>
                  <button class="btn light" style="padding:6px 9px" onclick="deleteRecord('${r.id}')">Excluir</button>
                </td>
              ` : ''}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// ============================================================================
// HISTÓRICO
// ============================================================================
function renderHistory() {
  const q = ($('search').value || '').toLowerCase();
  const from = $('from').value;
  const to = $('to').value;

  const list = records.filter(r =>
    (r.client + ' ' + r.cattle).toLowerCase().includes(q) &&
    (!from || r.date >= from) &&
    (!to || r.date <= to)
  );

  $('historyList').innerHTML = list.length
    ? tableHTML(list)
    : '<div class="empty">Nenhum registro encontrado.</div>';
}

// ============================================================================
// EXCLUIR REGISTRO
// ============================================================================
function deleteRecord(id) {
  if (!confirm('Excluir esta pesagem? Esta ação não pode ser desfeita.')) return;

  records = records.filter(r => r.id !== id);
  persist();
  renderHistory();
  toast('Registro excluído.', 'success');
}

// ============================================================================
// VISUALIZAR REGISTRO
// ============================================================================
function viewRecord(id) {
  const r = records.find(x => x.id === id);
  if (!r) return;

  const w = r.weights.map(x => `
    <tr>
      <td>${x.n}</td>
      <td>${fmt(x.kg)} kg</td>
      <td>${money(x.kg * r.price)}</td>
    </tr>
  `).join('');

  const win = window.open('', '_blank');
  if (!win) {
    toast('Permita pop-ups para abrir o relatório.', 'error');
    return;
  }

  win.document.write(`
    <!doctype html>
    <html lang="pt-BR">
    <meta charset="utf-8">
    <title>Relatório de pesagem</title>
    <style>
      body { font: 14px Arial; margin: 32px; color: #1e2922 }
      h1 { color: #173d2b }
      table { border-collapse: collapse; width: 100%; margin-top: 20px }
      td, th { border: 1px solid #ddd; padding: 8px; text-align: left }
      th { background: #eef2ed }
      .box { display: inline-block; padding: 12px; margin: 8px 8px 8px 0; background: #f3f5f1 }
      button { padding: 10px }
    </style>
    <h1>BELA VISTA AGRONEGÓCIOS</h1>
    <h2>Relatório de pesagem</h2>
    <p><b>Cliente:</b> ${esc(r.client)} &nbsp; <b>Data:</b> ${esc(r.date)} &nbsp; <b>Categoria:</b> ${esc(r.cattle)}</p>
    <p><b>Preço por kg:</b> ${money(r.price)}</p>
    <div class="box">Cabeças: <b>${r.heads}</b></div>
    <div class="box">Peso total: <b>${fmt(r.totalKg)} kg</b></div>
    <div class="box">Média: <b>${fmt(r.avgKg)} kg</b></div>
    <div class="box">Total: <b>${money(r.total)}</b></div>
    <table>
      <thead>
        <tr>
          <th>Animal</th>
          <th>Peso</th>
          <th>Valor</th>
        </tr>
      </thead>
      <tbody>
        ${w}
      </tbody>
    </table>
    <p><button onclick="window.print()">Imprimir / salvar PDF</button></p>
  `);
  win.document.close();
}

// ============================================================================
// EXPORTAÇÃO/IMPORTAÇÃO
// ============================================================================
function exportCSV() {
  const rows = [
    ['Data', 'Cliente', 'Categoria', 'Cabeças', 'Peso total kg', 'Média kg', 'Preço por kg', 'Valor total'],
    ...records.map(r => [r.date, r.client, r.cattle, r.heads, r.totalKg, r.avgKg, r.price, r.total])
  ];

  const csv = '\ufeff' + rows.map(r =>
    r.map(v => '"' + String(v ?? '').replace(/"/g, '""') + '"').join(';')
  ).join('\r\n');

  download(csv, 'bela-vista-pesagens.csv', 'text/csv;charset=utf-8;');
}

function exportBackup() {
  download(JSON.stringify(records, null, 2), 'bela-vista-backup.json', 'application/json');
}

function download(data, name, type) {
  const a = document.createElement('a');
  const u = URL.createObjectURL(new Blob([data], { type }));
  a.href = u;
  a.download = name;
  a.click();
  URL.revokeObjectURL(u);
}

function importBackup(e) {
  const f = e.target.files[0];
  if (!f) return;

  const rd = new FileReader();
  rd.onload = () => {
    try {
      const data = JSON.parse(rd.result);
      if (!Array.isArray(data)) throw 0;

      const ids = new Set(records.map(r => r.id));
      records = [...records, ...data.filter(r => !ids.has(r.id))];

      persist();
      renderHistory();
      toast('Backup importado com sucesso!', 'success');
    } catch (err) {
      toast('Arquivo de backup inválido.', 'error');
    }
    e.target.value = '';
  };
  rd.readAsText(f);
}

// ============================================================================
// INICIALIZAÇÃO
// ============================================================================
function init() {
  loadRecords();
  $('date').value = dateNow();
  $('price').addEventListener('input', () => {
  calc();
  renderWeightsList();
});
  renderDashboard();

  // Event listeners para navegação
  document.querySelectorAll('[data-tab]').forEach(b => {
    b.addEventListener('click', () => showTab(b.dataset.tab));
  });
}

// Iniciar aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', init);
