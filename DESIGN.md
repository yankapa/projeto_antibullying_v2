# Sistema visual: Caderno de convivência

<!-- impeccable:design-schema 1 -->

## Direção

Uma publicação editorial acolhedora feita por estudantes para ajudar colegas a reconhecer o bullying e encontrar apoio. A página começa pelo problema, apresenta o dado nacional com escala explícita e termina em atitudes, relato e ajuda. Uma coluna de leitura e margens amplas preservam a composição em celular e no monitor de 1920 × 1080.

## Tokens

| Papel | Token | Valor | Uso |
| --- | --- | --- | --- |
| Papel | `--paper` | `#F7F4ED` | Fundo principal |
| Tinta | `--ink` | `#20312F` | Títulos e corpo |
| Tinta secundária | `--muted` | `#53635F` | Metadados e apoio |
| Verde | `--green` | `#1D4440` | Marca e navegação |
| Coral | `--coral` | `#A84230` | Ação principal sobre fundo claro |
| Pêssego | `--peach` | `#F7BB91` | Dado principal sobre fundo escuro |
| Linha | `--line` | `#D7D8CF` | Separadores discretos |
| Fundo escuro | `--green-dark` | `#173734` | Área de dados e rodapé |

O corpo usa tinta escura sobre papel claro. O coral serve a ações e pontos de atenção; pêssego destaca a estatística no painel escuro.

## Tipografia

- Display: Alegreya variável, com itálico real, licença OFL, servida localmente; fallback Georgia/serif.
- Interface e corpo: DM Sans variável, licença OFL, servida localmente; fallback Segoe UI/sans-serif.
- Corpo: 1rem a 1.0625rem, linha 1.65, medida máxima 65ch.
- Hero: até 6rem no desktop, escala reduzida sem corte no celular; títulos com `text-wrap: balance`.
- Numerais de telefones com espaçamento e destaque consistentes.

## Composição e padrões

- Hero em uma coluna: problema, primeira ação e índice de três etapas.
- Seções de conteúdo com títulos claros e listas separadas por regras finas; os quatro tipos de bullying deixam de ser cartões equivalentes.
- Dados nacionais da PeNSE 2024 abrem a narrativa, identificados como nacionais e com fonte. Seguem reconhecimento, atitudes, relato e apoio.
- O formulário envia relatos sem campos de nome ou contato para um banco privado no Sites. A página pública está no GitHub Pages.
- Ajuda em área quente e clara, com contato escolar antes dos serviços públicos. Números `tel:` acionáveis e emergência separada do acolhimento.
- Cabeçalho simples, menu móvel acionável por teclado e foco visível. O modo alto contraste mantém sua identidade funcional.
- Um único arquivo CSS de produção, sem framework ou dependência JavaScript nova.

## Movimento

Os elementos permanecem visíveis durante toda a leitura. A barra fina de progresso acompanha o percurso e é removida quando há preferência por movimento reduzido.

## Breakpoints e verificação

Validar 390 e 1920 px, além dos pontos de colapso do menu; também texto ampliado, teclado, pesquisa, menu, alto contraste e links internos. A implementação exige inspeção real da interface e verificação de contraste WCAG 2.2 AA.
