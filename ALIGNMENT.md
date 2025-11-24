# Alinhamento do Microserviço Products com App-Service

## Resumo das Alterações

Este documento descreve as mudanças realizadas para alinhar o microserviço `products` com a estrutura e padrões do `app-service`.

## 1. Estrutura de Exceções ✅

### Criadas seguindo o padrão do app-service:

- **`CoreException`** (`src/common/exceptions/core.exception.ts`)
  - Classe base abstrata para todas as exceções
  - Contém: `code`, `message`, `shortMessage`

- **`ResourceNotFoundException`** (`src/common/exceptions/resource-not-found.exception.ts`)
  - Code: `NF404`
  - Para recursos não encontrados

- **`ResourceConflictException`** (`src/common/exceptions/resource-conflict.exception.ts`)
  - Code: `RC409`
  - Para conflitos (ex: nomes duplicados)

- **`ResourceInvalidException`** (`src/common/exceptions/resource-invalid.exception.ts`)
  - Code: `RIE400`
  - Para dados inválidos

- **`UnexpectedError`** (`src/common/exceptions/unexpected-error.exception.ts`)
  - Code: `UERR`
  - Para erros inesperados

## 2. Type CoreResponse ✅

**Arquivo:** `src/common/types/core-response.type.ts`

```typescript
export type CoreResponse<T> =
  | {
      value: T;
      error: undefined;
    }
  | {
      value: undefined;
      error: CoreException;
    };
```

Este type garante que:

- Sempre temos OU um valor OU um erro
- Nunca ambos ao mesmo tempo
- Tipagem forte e segura

## 3. Entidade Product ✅

### Campo adicionado:

- **`prepTime: number`** - Tempo de preparação em minutos

### Validação atualizada:

```typescript
isValid(): boolean {
  return !!(this.name && this.price > 0 && this.categoryId && this.prepTime > 0);
}
```

## 4. DTOs Atualizados ✅

### CreateProductDto

- ✅ Adicionado `prepTime` (obrigatório, mínimo 1)
- ✅ Documentação Swagger completa

### UpdateProductDto

- ✅ Adicionado `prepTime?` (opcional)
- ✅ Documentação Swagger completa

## 5. Migration ✅

**Arquivo:** `1730650000000-AddPrepTimeToProducts.ts`

- Adiciona coluna `prepTime` do tipo `int`
- Default: 15 minutos
- Reversível com `down()`

## 6. Entity TypeORM ✅

**Arquivo:** `src/external/infrastructure/database/entities/product.entity.ts`

- Adicionado campo `prepTime` com tipo `int`

## 7. Use Cases Refatorados ✅

### CreateProductUseCase

**Antes:**

```typescript
async execute(dto: CreateProductDto): Promise<Product>
```

**Depois:**

```typescript
async execute(dto: CreateProductDto): Promise<CoreResponse<Product>>
```

**Mudanças:**

- Retorna `CoreResponse<Product>` em vez de `Product`
- Erros não são lançados (throw), são retornados no `error`
- Sucesso retorna `{ error: undefined, value: product }`

## 8. Controllers Padronizados ✅

### Padrão Implementado:

```typescript
async create(@Body() dto: CreateProductDto) {
  try {
    const result = await this.createProductUseCase.execute(dto);

    if (result.error) {
      throw new HttpException(
        {
          statusCode: this.getStatusCodeFromError(result.error.code),
          message: result.error.message,
          error: result.error.shortMessage,
        },
        this.getStatusCodeFromError(result.error.code),
      );
    }

    return result.value;
  } catch (error) {
    // Handle unexpected errors
  }
}
```

### Mapeamento de Códigos de Erro:

```typescript
private getStatusCodeFromError(code: string): number {
  const statusMap: Record<string, number> = {
    NF404: HttpStatus.NOT_FOUND,       // 404
    RIE400: HttpStatus.BAD_REQUEST,    // 400
    RC409: HttpStatus.CONFLICT,        // 409
    UERR: HttpStatus.INTERNAL_SERVER_ERROR, // 500
  };
  return statusMap[code] || HttpStatus.INTERNAL_SERVER_ERROR;
}
```

## 9. Comparação com App-Service

### ✅ Alinhamentos Realizados:

| Aspecto             | App-Service        | Products (Antes) | Products (Depois)     |
| ------------------- | ------------------ | ---------------- | --------------------- |
| Exceções            | CoreException base | Error genérico   | CoreException base ✅ |
| Retorno Use Cases   | CoreResponse<T>    | T direto         | CoreResponse<T> ✅    |
| Tratamento de Erros | if (err) return    | throw exceptions | if (err) return ✅    |
| Códigos de Erro     | NF404, RIE400, etc | -                | Implementado ✅       |
| Campo prepTime      | ✓                  | ✗                | ✓ ✅                  |

### ✅ Diferenças Mantidas (Propositais):

| Aspecto   | App-Service       | Products        | Motivo                      |
| --------- | ----------------- | --------------- | --------------------------- |
| Framework | Custom            | NestJS          | Arquitetura de microserviço |
| ORM       | DataSource custom | TypeORM         | Escolha tecnológica         |
| Validação | Manual            | class-validator | Recurso do NestJS           |
| API Docs  | -                 | Swagger         | Melhor documentação         |

## 10. Padrão de Resposta

### Sucesso:

```json
{
  "id": "uuid",
  "name": "Product Name",
  "price": 15.99,
  "prepTime": 15,
  ...
}
```

### Erro:

```json
{
  "statusCode": 404,
  "message": "Category with ID xxx not found",
  "error": "Resource not found"
}
```

## 11. Próximos Passos

### Para completar o alinhamento:

1. **Atualizar outros Use Cases** seguindo o padrão CoreResponse:
   - ✅ CreateProductUseCase (feito)
   - ⏳ GetProductByIdUseCase
   - ⏳ ListProductsUseCase
   - ⏳ UpdateProductUseCase
   - ⏳ DeleteProductUseCase
   - ⏳ CreateCategoryUseCase
   - ⏳ ListCategoriesUseCase

2. **Atualizar outros Controllers** com tratamento de erro padronizado

3. **Atualizar testes** para refletir CoreResponse

4. **Executar migrations** no banco de dados

## 12. Benefícios da Padronização

✅ **Consistência**: Todos os microserviços seguem o mesmo padrão
✅ **Type Safety**: TypeScript garante que erros sejam tratados
✅ **Manutenibilidade**: Código mais fácil de entender e manter
✅ **Debugabilidade**: Códigos de erro claros e padronizados
✅ **Documentação**: Swagger reflete os tipos de erro possíveis
✅ **Testabilidade**: Fácil mockar CoreResponse nos testes

## 13. Checklist de Validação

- [x] CoreException implementada
- [x] CoreResponse type criado
- [x] Exceções específicas criadas
- [x] Campo prepTime adicionado
- [x] DTOs atualizados
- [x] Migration criada
- [x] Entity TypeORM atualizada
- [x] CreateProductUseCase refatorado
- [x] Controller padronizado
- [ ] Executar testes
- [ ] Rebuildar e testar aplicação
- [ ] Executar migration no banco

---

**Data:** 03/11/2025
**Status:** ✅ Alinhamento Base Concluído
**Próximo:** Aplicar padrão aos demais Use Cases e Controllers
