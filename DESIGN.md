# Sistema visual: Caderno de convivência

<!-- impeccable:design-schema 1 -->

## Direção

Uma publicação editorial acolhedora feita por estudantes para ajudar colegas a reconhecer o bullying e encontrar apoio. A página começa pelo problema, apresenta o dado nacional com escala explícita e termina em atitudes, relato e ajuda. A área principal cresce até 100rem, com margens fluidas; gráficos e listas chegam a 84rem, enquanto parágrafos e formulário mantêm medidas confortáveis. Em 1920 × 1080 a página usa melhor o monitor, e no celular conserva uma única coluna sem rolagem horizontal.

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

- Narrativa em capítulos que ocupam a altura da tela em 1920 × 1080 (área útil de até 100rem), com conteúdo em duas colunas no monitor e uma coluna no celular ou com texto ampliado.
- Abertura: título, chamada e pictograma 4 em 10 com contador animado (39,8%), mais uma faixa de cinco capítulos.
- Capítulo 01, história com rolagem: palco fixo com 1.000 cubos em Three.js (InstancedMesh) e oito passos de texto. Cada passo reorganiza os pontos: dispersos, reunidos, 2019 × 2024, meninas × meninos, redes sociais e prática. Sem WebGL, um canvas 2D desenha a mesma cena; sem JavaScript, os passos trazem todos os números.
- Capítulo 02, simulador: controle deslizante do tamanho da turma (15 a 45) e quatro indicadores; mostra a estimativa proporcional com pictograma e frase acessível (aria-live).
- Capítulo 03, recortes: três indicadores com barras animadas, mesma escala (0 a 35%) e marcador do total nacional.
- Motivos: barras selecionáveis (rosto/cabelo, não sabe, corpo, cor da pele) com nota explicativa.
- Capítulo 04, reconhecer: três sinais do bullying, teste interativo de quatro situações com retorno e placar, e os quatro tipos em quatro colunas.
- Capítulo 05, agir: abas acessíveis (setas do teclado) por situação — sofri, presenciei, pratiquei.
- Relato: orientações à esquerda e formulário à direita, com barra de progresso e contador de caracteres. O envio segue para o banco privado no Sites.
- Ajuda: contatos em grade 2 × 2. O modo alto contraste e o texto ampliado continuam funcionais (o menu vira botão com texto ampliado).
- Dados: IBGE, PeNSE 2024 (nacionais). Motivos citados conforme divulgação reproduzida pelo Jornal de Brasília.

## Movimento

Os elementos permanecem visíveis durante toda a leitura. A barra fina de progresso acompanha o percurso. A transição dos pontos usa aceleração suave; `prefers-reduced-motion` desativa essa animação.

## Breakpoints e verificação

Validar 390 e 1920 px, além dos pontos de colapso do menu; também texto ampliado, teclado, pesquisa, menu, alto contraste e links internos. A implementação exige inspeção real da interface e verificação de contraste WCAG 2.2 AA.
