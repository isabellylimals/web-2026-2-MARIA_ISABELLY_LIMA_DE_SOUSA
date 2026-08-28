# Plataforma de Portfólio Profissional

Plataforma web para criação e gerenciamento de portfólios profissionais de forma dinâmica, permitindo que freelancers e profissionais criativos apresentem seus trabalhos, personalizem sua página e recebam contatos de potenciais clientes.

> Projeto desenvolvido para a disciplina de Desenvolvimento Web — UFERSA.

---

## Sobre o Projeto

Profissionais como designers, fotógrafos, desenvolvedores, escritores e freelancers frequentemente utilizam redes sociais ou páginas estáticas para divulgar seus trabalhos.

Embora essas alternativas sejam acessíveis, elas podem apresentar limitações de personalização, organização das informações e gerenciamento do conteúdo.

A proposta deste projeto é desenvolver uma plataforma que permita ao profissional criar e gerenciar seu próprio portfólio sem depender diretamente de conhecimentos técnicos para realizar atualizações.

A plataforma terá suporte a templates personalizáveis, gerenciamento de projetos, depoimentos, métricas de acesso e um canal de contato para potenciais clientes.

---

## Objetivos

* Facilitar a criação e manutenção de portfólios profissionais;
* Permitir personalização da apresentação do portfólio;
* Centralizar projetos e informações profissionais;
* Disponibilizar métricas de visualização e interação;
* Facilitar o contato entre profissionais e potenciais clientes;
* Explorar uma arquitetura Serverless utilizando serviços da AWS;
* Aplicar conceitos de automação, organização de processos e escalabilidade.

---

## Perfis de Usuário

### Administrador

Responsável pelo gerenciamento geral da plataforma.

* Gerenciar usuários;
* Gerenciar templates;
* Visualizar métricas gerais;
* Gerenciar configurações da plataforma;
* Prestar suporte aos usuários.

### Profissional

Usuário responsável pela criação e gerenciamento do portfólio.

* Gerenciar informações profissionais;
* Criar e gerenciar projetos;
* Gerenciar depoimentos;
* Personalizar o portfólio;
* Visualizar métricas;
* Receber mensagens e propostas.

### Visitante

Usuário que acessa um portfólio publicado.

* Visualizar portfólios;
* Navegar pelos projetos;
* Acessar links externos;
* Enviar mensagens ou propostas de contato.

---

## Principais Funcionalidades

### Autenticação

* Cadastro de usuários;
* Login;
* Controle de acesso;
* Diferenciação de permissões por perfil.

### Gerenciamento de Portfólio

* Criação e edição do perfil profissional;
* Upload de imagem de perfil;
* Gerenciamento de links;
* Seleção de templates;
* Personalização do portfólio.

### Gerenciamento de Projetos

* Cadastro de projetos;
* Edição e exclusão;
* Categorias e tags;
* Imagens e vídeos;
* Links para projetos externos.

### Contato

* Formulário de contato;
* Recebimento de mensagens;
* Envio de propostas de contratação.

### Métricas

* Visualizações do portfólio;
* Visualizações de projetos;
* Cliques em links;
* Quantidade de contatos recebidos.

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
https://calculator.aws/#/estimate?id=40e6682c69e0dcf2c9fbfc9d8b0a05286ad634b0

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
