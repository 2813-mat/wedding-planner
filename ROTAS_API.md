# Rotas da API - Documentação

Este documento lista todas as rotas que o frontend espera que existam no backend.

## Base URL
- **Desenvolvimento**: `http://localhost:3013` (via proxy `/api`)
- **Produção**: Configurado via `VITE_API_BASE_URL`

## Autenticação

### POST `/auth/sync-user`
Sincroniza/cria o usuário no backend após autenticação Auth0.

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Resposta esperada:**
- Status: `200 OK`
- Body: Dados do usuário sincronizado

---

## Presentes (Gifts)

### GET `/gifts`
Lista todos os presentes.

**Headers:**
- `Authorization: Bearer <token>`

**Resposta esperada:**
```json
[
  {
    "id": number,
    "name": string,
    "description": string,
    "priority": "alta" | "media" | "baixa",
    "price": number,
    "url": string | null,
    "purchased": boolean,
    "purchasedBy": string | null
  }
]
```

### POST `/gifts`
Cria um novo presente.

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Body:**
```json
{
  "name": string,
  "description": string,
  "priority": "alta" | "media" | "baixa",
  "price": number,
  "url": string | null,
  "purchased": boolean | null,
  "purchasedBy": string | null
}
```

### PUT `/gifts/:id`
Atualiza um presente existente.

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Body:** (campos parciais)
```json
{
  "name": string | null,
  "description": string | null,
  "priority": "alta" | "media" | "baixa" | null,
  "price": number | null,
  "url": string | null,
  "purchased": boolean | null,
  "purchasedBy": string | null
}
```

### DELETE `/gifts/:id`
Remove um presente.

**Headers:**
- `Authorization: Bearer <token>`

---

## Lua de Mel (Honeymoon)

### GET `/honeymoon`
Lista todas as informações da lua de mel.

**Headers:**
- `Authorization: Bearer <token>`

**Resposta esperada:**
```json
[
  {
    "id": number,
    "destination": string,
    "name": string,
    "startDate": string,
    "endDate": string,
    "budget": number,
    "spent": number,
    "notes": string | null,
    "status": "planejando" | "confirmado" | "em_progresso" | "concluido",
    "image": string
  }
]
```

### POST `/honeymoon`
Cria uma nova entrada de lua de mel.

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Body:**
```json
{
  "destination": string,
  "startDate": string,
  "endDate": string,
  "budget": number,
  "spent": number | null,
  "notes": string | null,
  "status": "planejando" | "confirmado" | "em_progresso" | "concluido" | null
}
```

### PUT `/honeymoon/:id`
Atualiza informações da lua de mel.

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Body:** (campos parciais)
```json
{
  "destination": string | null,
  "startDate": string | null,
  "endDate": string | null,
  "budget": number | null,
  "spent": number | null,
  "notes": string | null,
  "status": "planejando" | "confirmado" | "em_progresso" | "concluido" | null
}
```

### DELETE `/honeymoon/:id`
Remove uma entrada de lua de mel.

**Headers:**
- `Authorization: Bearer <token>`

---

## Convidados (Guests)

### GET `/guests`
Lista todos os convidados.

**Headers:**
- `Authorization: Bearer <token>`

**Resposta esperada:**
```json
[
  {
    "id": number,
    "name": string,
    "email": string,
    "phone": string,
    "category": "familia_noiva" | "familia_noivo" | "amigos" | "trabalho",
    "status": "confirmado" | "pendente" | "nao_vai",
    "guests": number
  }
]
```

### POST `/guests`
Cria um novo convidado.

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Body:**
```json
{
  "name": string,
  "email": string,
  "phone": string,
  "category": "familia_noiva" | "familia_noivo" | "amigos" | "trabalho",
  "status": "confirmado" | "pendente" | "nao_vai" | null,
  "guests": number | null
}
```

### PUT `/guests/:id`
Atualiza um convidado.

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Body:** (campos parciais)
```json
{
  "name": string | null,
  "email": string | null,
  "phone": string | null,
  "category": "familia_noiva" | "familia_noivo" | "amigos" | "trabalho" | null,
  "status": "confirmado" | "pendente" | "nao_vai" | null,
  "guests": number | null
}
```

### DELETE `/guests/:id`
Remove um convidado.

**Headers:**
- `Authorization: Bearer <token>`

---

## Fornecedores (Vendors)

### GET `/vendors`
Lista todos os fornecedores.

**Headers:**
- `Authorization: Bearer <token>`

**Resposta esperada:**
```json
[
  {
    "id": number,
    "name": string,
    "category": string,
    "email": string,
    "phone": string,
    "service": string,
    "budget": number,
    "status": "ativo" | "inativo"
  }
]
```

### POST `/vendors`
Cria um novo fornecedor.

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Body:**
```json
{
  "name": string,
  "category": string,
  "email": string,
  "phone": string,
  "service": string,
  "budget": number,
  "status": "ativo" | "inativo" | null
}
```

### PUT `/vendors/:id`
Atualiza um fornecedor.

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Body:** (campos parciais)
```json
{
  "name": string | null,
  "category": string | null,
  "email": string | null,
  "phone": string | null,
  "service": string | null,
  "budget": number | null,
  "status": "ativo" | "inativo" | null
}
```

### DELETE `/vendors/:id`
Remove um fornecedor.

**Headers:**
- `Authorization: Bearer <token>`

---

## Notas Importantes

1. **Todas as rotas (exceto `/auth/sync-user`) requerem autenticação** via header `Authorization: Bearer <token>`

2. **Códigos de status esperados:**
   - `200 OK` - Sucesso
   - `201 Created` - Criado com sucesso (para POST)
   - `400 Bad Request` - Dados inválidos
   - `401 Unauthorized` - Token inválido/expirado
   - `404 Not Found` - Recurso não encontrado
   - `500 Internal Server Error` - Erro no servidor

3. **Formato de datas:** Strings no formato ISO 8601 (ex: `"2024-12-31T00:00:00.000Z"`)

4. **IDs:** Números inteiros positivos
