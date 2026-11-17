# projeto_antibullying_v2


https://yankapa.github.io/projeto_antibullying_v2/

Site estático publicado pelo GitHub Pages. O formulário de relato envia os dados
ao endpoint `/api/relatos` do serviço Sites do projeto; os relatos são guardados
em uma tabela privada e não ficam no repositório GitHub. Não há campos de nome
ou contato.

## Dados

Os percentuais de bullying sofrido, praticado e nas redes sociais são nacionais,
referentes a estudantes de 13 a 17 anos. A comparação de 2019 com 2024 usa a
mesma definição de bullying recorrente. Os recortes de 2024 são apresentados
com uma escala comum de 0 a 35%. Fonte: [IBGE, PeNSE 2024](https://agenciadenoticias.ibge.gov.br/agencia-sala-de-imprensa/2013-agencia-de-noticias/releases/46171-5-edicao-da-pense-meninas-sao-as-maiores-vitimas-de-violencia-sexual).

A visualização de 1.000 pontos é uma simulação proporcional, não uma amostra
da escola. Ela usa [Three.js 0.187.0](https://threejs.org/) sob licença MIT,
incluída em `assets/vendor/three/LICENSE`. O módulo é carregado apenas quando
a visualização se aproxima da tela. Os gráficos e valores permanecem no HTML
sem WebGL ou JavaScript.

Para visualizar localmente, inicie um servidor estático na raiz do repositório,
por exemplo `python -m http.server 8000`, e abra `http://localhost:8000/`.
