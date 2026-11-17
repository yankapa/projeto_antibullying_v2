# Sistema visual: Caderno de convivência

<!-- impeccable:design-schema 1 -->

## Direção

Uma publicação editorial feita por estudantes para ajudar colegas a reconhecer o bullying e encontrar apoio. A página usa tipografia expressiva, margens generosas e divisórias finas de leitura. A composição aprovada substitui a grade de cartões e os efeitos de brilho da proposta anterior. A imagem de referência é uma composição, não fonte de texto factual.

## Tokens

| Papel | Token | Valor | Uso |
| --- | --- | --- | --- |
| Papel | `--paper` | `#FAF9F4` | Fundo principal |
| Tinta | `--ink` | `#101F32` | Títulos e corpo |
| Tinta secundária | `--muted` | `#52636B` | Metadados e apoio |
| Verde | `--sage` | `#456A59` | Navegação e linhas de orientação |
| Verde claro | `--sage-soft` | `#E9F0E9` | Área de conteúdo calmo |
| Coral | `--coral` | `#B84637` | Ação principal sobre fundo claro |
| Linha | `--line` | `#B9C9BE` | Separadores discretos |
| Fundo escuro | `--dark` | `#143E43` | Área de ajuda |

`--ink` sobre `--paper` tem relação de contraste calculada de 15,76:1; branco sobre `--coral`, 5,29:1; `--sage` sobre `--paper`, 5,76:1. Os estados e demais combinações exigem validação renderizada.

## Tipografia

- Display: Newsreader, licença OFL, servida localmente; fallback Georgia/serif.
- Interface e corpo: pilha de sistema sem dependência de rede.
- Corpo: 1rem a 1.0625rem, linha 1.6, medida máxima 70ch.
- Hero: até 6rem no desktop, escala reduzida sem corte no celular; títulos com `text-wrap: balance`.
- Numerais de telefones com espaçamento e destaque consistentes.

## Composição e padrões

- Hero em uma coluna: problema, primeira ação e índice de três etapas.
- Seções de conteúdo com títulos claros e listas separadas por regras finas; os quatro tipos de bullying deixam de ser cartões equivalentes.
- Dados nacionais da PeNSE 2024 abrem a narrativa, identificados como nacionais e com fonte. Seguem reconhecimento, atitudes, relato e apoio.
- O formulário envia relatos sem campos de nome ou contato para um banco privado no Sites. A página pública está no GitHub Pages.
- Ajuda em área de alto contraste, com contato escolar antes dos serviços públicos. Números `tel:` acionáveis e emergência separada do acolhimento.
- Cabeçalho simples, menu móvel acionável por teclado e foco visível. O modo alto contraste mantém sua identidade funcional.
- Um único arquivo CSS de produção, sem framework ou dependência JavaScript nova.

## Movimento

O título e as seções têm entradas breves. `prefers-reduced-motion` remove deslocamentos e animações.

## Breakpoints e verificação

Validar 320, 390, 768, 1024 e 1440 px; também texto ampliado a 200%, teclado, pesquisa, menu, alto contraste e links internos. A implementação só é aprovada após inspeção real da interface e verificação de contraste WCAG 2.2 AA.
