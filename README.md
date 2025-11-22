No arquivo AreaPais.jsx
é necessário motrar quais crianças estão cadastradas com o usuário logado

# Academia de Hábitos — v1

## Resumo

Aplicação React para transformar rotinas infantis em missões gamificadas. Protótipo com backend simulado (JSON Server).

## Requisitos

- Node.js (v14+)
- npm ou yarn
- json-server (para simular API REST em localhost:3001)

## Instalação

1. Instale dependências:
   npm install

2. Inicie o JSON Server (na raiz do projeto onde está o `db.json`):
   npx json-server --watch db.json --port 3001

3. Inicie a aplicação React:
   npm start

## Scripts úteis

- npm start — inicia o dev server React
- npx json-server --watch db.json --port 3001 — inicia API simulada

## Arquitetura e fluxo

- src/App.jsx — landing e controle de sessão (estado local `usuarioLogado`).
- src/Login.jsx e src/pages/Registro.jsx — telas de autenticação (protótipo: busca/valida usuários via JSON Server).
- src/pages/SelecaoPerfil.jsx — permite escolher entre área dos pais e área da criança (token).
- src/pages/CriarTrilha.jsx — criação de trilhas (coleção de tarefas) e POST para `/trilhas`.
- Dados persistidos no cliente via `localStorage` (chaves `usuarioLogado` e `criancaLogada`).

## Observações importantes (protótipo)

- Autenticação atual: comparação de senha no cliente e leitura de usuários via GET `/usuarios`. Isso é aceitável somente em protótipo — em produção mova validação para o servidor e retorne tokens (JWT ou similar).
- Não armazene senhas em localStorage em produção. Prefira tokens de acesso com expiração.
- Muitas rotas usam `window.location.href`, o que provoca reload completo. Em SPA com react-router recomenda-se `useNavigate` para navegação sem reload.

## Problema conhecido: botões de autenticação com larguras inconsistentes

Sintoma: botões na seção de autenticação (ex.: `Criar Conta` e `Já tenho conta`) aparecem com larguras diferentes em algumas telas.

Causa provável:

- Elementos possuem tipos/semântica diferentes (<input>, <a>, <button>) e estilos aplicados não forçam `display` e `box-sizing` consistentes — assim `width: 90%` nem sempre se aplica igual.

Solução sugerida (adicione ao Auth.css ou ajuste conforme preferir):

```css
/* filepath: c:\Users\elint\Senac\engenhariaDeSoftware\academiaHabitos_v1\src\Auth.css */
/* Garantir comportamento consistente dos botões na área de autenticação */
.auth-container .form-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
  margin: 0 auto;
  max-width: 420px; /* opcional: limita largura do grupo */
}

.btn,
.btn a,
.btn,
a,
input[type="submit"],
button {
  display: block;
  width: 100%;
  box-sizing: border-box;
}
```

- Alternativa: manter `.btn { display:block; width:100%; box-sizing:border-box }` e remover larguras conflitantes (ex.: width:80%/90% espalhados).

## Melhorias futuras recomendadas

- Mover autenticação para backend (POST /login) e usar tokens.
- Proteger endpoints por `responsavelId` no servidor (filtragem/autorização).
- Substituir prompt()/alert() por modais/mensagens inline.
- Centralizar estado de autenticação com Context ou Redux se precisar compartilhar globalmente.

## Contribuição

- Abra uma issue descrevendo o objetivo.
- Fork → branch → PR.
- Documente mudanças no README quando alterar fluxos (autenticação/trilhas).

## Contato

Equipe de desenvolvimento — manter instruções e segurança atualizadas conforme evolução do projeto.

No arquivo AreaPais.jsx
é necessário motrar quais crianças estão cadastradas com o usuário logado
