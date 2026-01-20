# ADR-001: Bucket de Storage Público para Anexos

## Status
**Aceite** - 2026-01-19

## Contexto
A aplicação permite que o admin faça upload de anexos (imagens e PDFs) nas atualizações dos clientes. Estes ficheiros precisam ser acessíveis aos clientes quando visualizam as suas atualizações.

O Supabase Storage oferece duas opções:
1. **Bucket público** - URLs diretos, qualquer pessoa com o link pode aceder
2. **Bucket privado** - Requer signed URLs com expiração

## Decisão
Optámos por utilizar um **bucket público** para os anexos.

## Justificação

### Segurança por obscuridade (aceitável neste contexto)
- URLs contêm múltiplos UUIDs e timestamps aleatórios
- Formato: `/{clientId}/{updateId}/{timestamp}-{random}.{ext}`
- Exemplo: `/4a1a5bf1-2d56-4868-bfcc-99949bd.../a8f3c2e1.../1705693200000-x7k2m9p.jpg`
- Probabilidade de adivinhar um URL válido é negligenciável

### Simplicidade
- Não requer geração de signed URLs em cada request
- Melhor performance (URLs diretos, sem round-trip extra)
- Menos complexidade no código

### Natureza dos dados
- Fotos de tratamentos capilares (não são dados altamente sensíveis)
- Já protegidos por autenticação na aplicação
- Apenas clientes autenticados veem os links na UI

### Restrições de upload
- Apenas admins podem fazer upload (policy RLS)
- Validação de tipo de ficheiro (apenas imagens e PDF)
- Limite de 10MB por ficheiro

## Consequências

### Positivas
- Implementação simples e rápida
- Melhor performance no carregamento de imagens
- Menos código para manter

### Negativas
- Se um URL for partilhado, qualquer pessoa pode aceder
- Não há expiração automática de acesso
- Ficheiros podem ser indexados se URLs forem expostos

### Riscos mitigados
- URLs não são expostos publicamente (apenas na área autenticada)
- Estrutura de pastas com UUIDs torna URLs imprevisíveis
- Monitorização de acesso disponível no Supabase Dashboard

## Alternativas consideradas

### Signed URLs (rejeitada para MVP)
- **Prós**: Controlo total de acesso, URLs expiram
- **Contras**: Complexidade adicional, pior performance, mais código
- **Decisão**: Pode ser implementado no futuro se necessário

### Proxy através da API (rejeitada)
- **Prós**: Controlo total, sem exposição de URLs
- **Contras**: Overhead significativo, custos de bandwidth, complexidade
- **Decisão**: Overengineering para o caso de uso atual

## Revisão futura
Esta decisão deve ser revista se:
- A aplicação passar a armazenar dados sensíveis (documentos médicos, etc.)
- Houver requisitos de compliance (RGPD com dados sensíveis)
- For detectado acesso não autorizado aos ficheiros
- O número de clientes crescer significativamente (>1000)

## Referências
- [Supabase Storage Access Control](https://supabase.com/docs/guides/storage/access-control)
- [Signed URLs Documentation](https://supabase.com/docs/reference/javascript/storage-from-createsignedurl)
