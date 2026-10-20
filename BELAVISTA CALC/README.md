# Sistema de Controle de Pesagem - Bela Vista Agronegócios

## Versão 2.2 - Interface Calculadora

### 📁 Estrutura de Arquivos

O sistema foi reorganizado em 3 arquivos separados para melhor manutenção:

- **index.html** - Estrutura HTML da aplicação
- **styles.css** - Todos os estilos e design
- **app.js** - Lógica JavaScript da aplicação

### ✨ Novas Funcionalidades

#### 1. **Interface Calculadora para Pesos**
- Campo único para digitar o peso
- Botão "＋ Adicionar" para incluir na lista
- **Sem limite de quantidade** de animais
- Lista visual com todos os pesos adicionados
- Cada item mostra: número, peso (kg) e valor calculado
- Botão "×" para remover itens individuais
- Pressione Enter para adicionar rapidamente
- Cálculo automático em tempo real

#### 2. **Botão "Finalizar Pesagem" com Relatório Prévio**
- Antes de salvar, o usuário pode revisar todos os dados
- Modal completo com estatísticas detalhadas
- Opção de voltar e editar ou confirmar e salvar

#### 2. **Relatório Detalhado**
O relatório prévio inclui:
- Dados básicos (cliente, data, categoria, preço)
- Estatísticas principais (cabeças, peso total, média, valor total)
- **Distribuição de pesos** por faixas:
  - 0-200 kg
  - 200-300 kg
  - 300-400 kg
  - 400-500 kg
  - 500-600 kg
  - 600+ kg
- Lista detalhada de todos os animais com pesos e valores

#### 3. **Validações Robustas**
- Validação de cliente (nome obrigatório, mínimo 3 caracteres)
- Validação de data (campo obrigatório)
- Validação de preço (não pode ser negativo)
- Validação de pesos (entre 0 e 2000 kg)
- Mensagens de erro claras e específicas
- Indicação visual de campos com erro (borda vermelha)
- Mensagens de erro abaixo dos campos

#### 4. **Melhorias no Código**
- Código organizado em seções claras com comentários
- Funções modulares e reutilizáveis
- Constantes para valores configuráveis
- Melhor legibilidade e manutenibilidade
- Tratamento de erros aprimorado

#### 5. **Melhorias na Interface**
- Design mais consistente e profissional
- Cores adicionais para feedback (erro, sucesso, aviso)
- Melhor responsividade para dispositivos móveis
- Modal elegante para relatórios
- Indicadores visuais melhorados

### 🚀 Como Usar

1. Abra o arquivo `index.html` em qualquer navegador moderno
2. Navegue entre as abas: Visão Geral, Nova Pesagem, Histórico
3. Para uma nova pesagem:
   - Preencha os dados (cliente, data, categoria, preço)
   - No campo de calculadora, digite o peso e clique em "＋ Adicionar" (ou pressione Enter)
   - Repita para todos os animais (sem limite de quantidade)
   - Remova itens errados clicando no "×"
   - O sistema calcula automaticamente em tempo real
   - Clique em "📋 Finalizar pesagem (Revisar)"
   - Revise o relatório completo com distribuição de pesos
   - Confirme para salvar ou volte para editar

### 💾 Backup e Restauração

- **Exportar CSV**: Planilha compatível com Excel
- **Exportar Backup JSON**: Backup completo para transferência
- **Importar Backup**: Restaurar dados de outro dispositivo

### 📊 Estatísticas no Dashboard

- Total de pesagens salvas
- Número de animais pesados
- Peso acumulado
- Valor acumulado

### 🔍 Filtros no Histórico

- Busca por texto (cliente ou categoria)
- Filtro por período (data inicial e final)

### 🖨️ Impressão

- Opção de imprimir/salvar PDF
- Formatação otimizada para impressão
- Remove elementos desnecessários

### ⚠️ Limitações

- Dados armazenados localmente no navegador (LocalStorage)
- Sem limite de animais por pesagem (flexível)
- Sem backend ou sincronização entre dispositivos
- Use o backup/restore para transferir dados

### 🎯 Próximas Melhorias Sugeridas

- Adicionar gráficos de tendência
- Implementar autenticação de usuários
- Adicionar backend com banco de dados
- Sincronização entre dispositivos
- Relatórios personalizados
- Comparação entre pesagens do mesmo cliente

### 📝 Notas Técnicas

- Sem dependências externas
- 100% JavaScript puro (ES6+)
- CSS moderno com variáveis
- Design responsivo
- Compatível com todos os navegadores modernos

---

**Desenvolvido para Bela Vista Agronegócios**
