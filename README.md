# Plataforma de Conexão entre Fotógrafos e Clientes

Plataforma web para conectar fotógrafos de eventos a clientes que buscam serviços fotográficos. O sistema permite que fotógrafos divulguem seus serviços, portfólios e disponibilidade, enquanto clientes podem pesquisar, comparar e solicitar orçamentos diretamente pela plataforma.

> Projeto desenvolvido para a disciplina de **Desenvolvimento Web** — UFERSA.

---

##  Sobre o Projeto

Encontrar um fotógrafo adequado para um evento pode ser uma tarefa difícil, principalmente quando o cliente precisa comparar diferentes profissionais, tipos de serviço e faixas de preço. Atualmente, essa busca ocorre frequentemente por meio de redes sociais, indicações pessoais ou aplicativos de mensagens, dificultando a organização das informações.

**A solução proposta** é uma plataforma web que centraliza informações sobre fotógrafos, seus serviços, preços, disponibilidade e trabalhos já realizados, facilitando a conexão entre profissionais e clientes.

---

## Objetivos

- Facilitar a busca e comparação de fotógrafos por clientes;
- Permitir que fotógrafos divulguem seus serviços e portfólio;
- Centralizar informações de serviços, preços e disponibilidade;
- Permitir envio e acompanhamento de solicitações de orçamento;
- Explorar uma arquitetura Serverless utilizando serviços da AWS;
- Aplicar conceitos de escalabilidade, baixo custo e automação.

---

##  Perfis de Usuário

###  Administrador

Responsável pela administração geral da plataforma.

- Gerenciar usuários;
- Aprovar ou remover cadastros de fotógrafos;
- Gerenciar categorias de eventos;
- Moderar fotografias e informações publicadas;
- Visualizar métricas gerais da plataforma;
- Gerenciar configurações do sistema.

###  Fotógrafo

Profissional que utiliza a plataforma para divulgar seus serviços.

- Criar e editar seu cadastro profissional;
- Cadastrar os tipos de eventos que atende;
- Cadastrar serviços oferecidos;
- Informar preços ou faixas de preço;
- Informar disponibilidade;
- Adicionar e remover fotografias de eventos realizados;
- Visualizar solicitações de orçamento;
- Responder às solicitações recebidas.

### Cliente

Usuário que busca um fotógrafo para contratar.

- Pesquisar fotógrafos;
- Filtrar fotógrafos por tipo de evento;
- Visualizar informações dos profissionais;
- Visualizar fotografias de trabalhos realizados;
- Consultar serviços e preços;
- Consultar disponibilidade;
- Enviar solicitações de orçamento;
- Acompanhar suas solicitações.

---

##  Principais Funcionalidades

### Autenticação e Controle de Acesso

- Cadastro e login de usuários;
- Controle de acesso baseado em perfis (Administrador, Fotógrafo, Cliente);
- Gerenciamento de identidade via Amazon Cognito.

### Gerenciamento de Fotógrafos e Serviços

- Cadastro profissional (nome, descrição, cidade, contato);
- Cadastro de tipos de eventos atendidos;
- Cadastro de serviços com descrição, preço e duração;
- Gerenciamento de disponibilidade.

### Portfólio de Trabalhos

- Upload de fotografias de eventos realizados;
- Título, descrição, tipo de evento e data;
- Armazenamento seguro no Amazon S3.

### Solicitações de Orçamento

- Clientes enviam solicitações para fotógrafos;
- Informações: nome, e-mail, tipo de evento, data, local, mensagem;
- Status da solicitação (enviada, visualizada, respondida);
- Fotógrafos visualizam e respondem solicitações.

### Métricas e Analytics

- Visualizações do perfil do fotógrafo;
- Visualizações das fotografias;
- Cliques em contato;
- Quantidade de solicitações de orçamento;
- Taxa de resposta dos fotógrafos.

---

## Arquitetura

A aplicação será desenvolvida utilizando uma arquitetura **Serverless**, buscando reduzir custos de infraestrutura e permitir escalabilidade conforme o crescimento da plataforma.

### Arquitetura proposta

```text
                    ┌──────────────────────┐
                    │       Usuário        │
                    │      Navegador       │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   CloudFront + S3    │
                    │      Frontend        │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    API Gateway       │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      AWS Lambda      │
                    │   Regras de negócio  │
                    └──────┬─────────┬─────┘
                           │         │
                 ┌─────────▼───┐ ┌──▼──────────┐
                 │  DynamoDB   │ │     S3      │
                 │    Dados    │ │    Mídias    │
                 └─────────────┘ └─────────────┘

                    ┌──────────────────────┐
                    │    Amazon Cognito    │
                    │   Autenticação       │
                    └──────────────────────┘
```

### Serviços AWS

| Serviço            | Utilização                                       |
| ------------------ | ------------------------------------------------ |
| Amazon S3          | Hospedagem do frontend e armazenamento de mídias |
| Amazon CloudFront  | Distribuição do frontend                         |
| AWS Lambda         | Execução da lógica de negócio                    |
| Amazon API Gateway | Disponibilização das APIs                        |
| Amazon DynamoDB    | Armazenamento dos dados                          |
| Amazon Cognito     | Autenticação e gerenciamento de usuários         |

---

## Tecnologias

As tecnologias previstas para o desenvolvimento incluem:

* **Frontend:** React
* **Backend:** Python
* **Banco de dados:** Amazon DynamoDB
* **Armazenamento:** Amazon S3
* **Autenticação:** Amazon Cognito
* **API:** Amazon API Gateway
* **Computação:** AWS Lambda
* **Distribuição:** Amazon CloudFront
* **Versionamento:** Git/GitHub

---

## Estrutura Inicial do Projeto

```text
web-2026-2-MARIA_ISABELLY_LIMA_DE_SOUSA/
│
├── frontend/
│   └── ...
│
├── backend/
│   └── ...
│
├── docs/
│   ├── arquitetura/
│   └── requisitos/
│
├── README.md
└── .gitignore
```

A estrutura poderá ser modificada conforme o desenvolvimento do projeto.

---

## Estimativa de Infraestrutura

A infraestrutura foi planejada utilizando serviços Serverless da AWS.

A estimativa de custos foi realizada utilizando a **AWS Pricing Calculator**, considerando um cenário inicial de baixo volume de usuários, requisições e armazenamento.

**Estimativa:**
https://calculator.aws/#/estimate?id=70148b4d82c2824283c859f84a416fbab71fd3f5

O custo real poderá variar de acordo com o crescimento da aplicação e o volume de utilização dos serviços.

---

## Inteligência Artificial

Ferramentas de Inteligência Artificial serão utilizadas como apoio ao longo do desenvolvimento do projeto.

Entre as aplicações previstas estão:

* Levantamento e refinamento de requisitos;
* Identificação de regras de negócio;
* Geração de cenários e critérios de aceitação;
* Apoio na documentação;
* Auxílio durante o desenvolvimento;
* Revisão e identificação de possíveis problemas.

As sugestões produzidas por ferramentas de IA serão analisadas e validadas pela equipe antes de serem incorporadas ao projeto.

---

## Documentação

A documentação do projeto será atualizada conforme o desenvolvimento.

* [Descrição do projeto](docs/requisitos/descricao.md)
* [Arquitetura](docs/arquitetura/arquitetura.md)
* [Regras de negócio](docs/requisitos/regras-de-negocio.md)


## Projeto Acadêmico

Projeto desenvolvido para a disciplina de Desenvolvimento Web da **Universidade Federal Rural do Semi-Árido (UFERSA)**.

**Repositório:** `web-2026-2-MARIA_ISABELLY_LIMA_DE_SOUSA`

**Autora:** Maria Isabelly
