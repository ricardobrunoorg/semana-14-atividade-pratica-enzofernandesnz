[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/jLbvBzzN)

# Trabalho Prático - Semana 14

## Informações do trabalho

- **Nome:** Enzo Fernandes
- **Matrícula:** _[coloque sua matrícula aqui]_
- **Proposta de projeto escolhida:** Gerenciador de Eventos
- **Breve descrição:** Sistema web para cadastro e visualização interativa de eventos (shows, workshops, palestras e conferências). Permite criar, editar e excluir eventos via CRUD, e apresenta os dados em um dashboard com calendário interativo, gráficos de distribuição e mapa geográfico.

---

## Tecnologias utilizadas

- **Node.js** — plataforma de execução JavaScript no servidor
- **JSON Server** — servidor fake REST API (`http://localhost:3000/eventos`)
- **FullCalendar v6** — calendário interativo com visualização mensal e em lista
- **Chart.js v4** — gráficos de rosca (distribuição por tipo) e barras (eventos por mês)
- **Leaflet.js v1.9** — mapa interativo com marcadores coloridos por tipo de evento (OpenStreetMap, gratuito)
- **HTML/CSS/JS puro** — sem frameworks frontend adicionais

---

## Estrutura de páginas

| Arquivo | Descrição |
|---|---|
| `public/index.html` | Página de CRUD — cadastro, edição e exclusão de eventos |
| `public/dashboard.html` | Página de visualização dinâmica — calendário, gráficos e mapa |

---

## Como executar

```bash
# Instalar dependências
npm install

# Iniciar o servidor JSON (porta 3000)
npm start
```

Depois abra `public/index.html` ou `public/dashboard.html` no navegador (recomendado: extensão **Live Server** no VS Code).

---

## Implementação — Etapa 2

### Visualizações implementadas no `dashboard.html`

**1. Calendário interativo (FullCalendar)**  
Exibe todos os eventos cadastrados no JSON Server em um calendário mensal. Cada tipo de evento possui uma cor distinta. Ao clicar em um evento, um modal exibe os detalhes completos. Suporta alternância entre visualização mensal e lista.

**2. Gráfico de rosca — Distribuição por tipo (Chart.js)**  
Mostra a proporção de eventos por categoria (show, workshop, palestra, conferência) com cores distintas e legenda interativa.

**3. Gráfico de barras — Eventos por mês (Chart.js)**  
Exibe a quantidade de eventos agrupados por mês, permitindo identificar os períodos de maior concentração de atividades.

**4. Mapa com localização (Leaflet.js + OpenStreetMap)**  
Posiciona marcadores coloridos por tipo de evento sobre um mapa interativo do Brasil, usando Leaflet.js com tiles gratuitos do OpenStreetMap. Ao clicar em um marcador, abre popup com nome, local e data, e também exibe o modal de detalhes.

---

## Prints da implementação

### Tela 1 — Dashboard com Calendário e Gráficos

![Tela 1 - Calendário e Gráficos](prints/tela1.png)

> _Substitua pela imagem real. Tire o print do dashboard com o calendário e gráficos visíveis._

### Tela 2 — Mapa com Localização dos Eventos

![Tela 2 - Mapa](prints/tela2.png)

> _Substitua pela imagem real. Tire o print do mapa com os marcadores dos eventos._
