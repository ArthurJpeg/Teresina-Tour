# 🌆 Teresina Tour

Aplicativo mobile desenvolvido para facilitar a descoberta de pontos turísticos, culturais, históricos, ambientais e de lazer da cidade de **Teresina – PI**, reunindo informações sobre locais e eventos da capital em uma única plataforma.

O projeto foi desenvolvido como atividade de extensão universitária do curso de **Bacharelado em Ciência da Computação da UNINASSAU**, dentro da temática **Cidades Inteligentes e Prototipagem de Soluções**.

---

## 📱 Sobre o projeto

O **Teresina Tour** surgiu com a proposta de centralizar informações turísticas que podem estar distribuídas em diferentes fontes, facilitando a descoberta de locais e atividades disponíveis na cidade.

Por meio do aplicativo, o usuário pode explorar pontos de interesse de Teresina, pesquisar locais, filtrar por categorias, consultar informações detalhadas, salvar favoritos, visualizar eventos e acessar a localização dos pontos pelo Google Maps.

O aplicativo também possui uma área de informações institucionais, contato e acesso à Política de Privacidade.

**O Teresina Tour é uma iniciativa acadêmica independente, sem vínculo oficial com órgãos governamentais.**

---

## ✨ Funcionalidades

- 🔎 Pesquisa de pontos de interesse
- 🗂️ Filtragem por categorias
- 📍 Informações detalhadas dos locais
- 🖼️ Imagens dos pontos turísticos
- 🕐 Horários de funcionamento
- ⭐ Consulta de avaliações públicas dos locais
- 🗺️ Integração com Google Maps
- ❤️ Sistema de favoritos com persistência local
- 📅 Agenda de eventos de Teresina
- 🔎 Pesquisa de eventos
- 🔄 Atualização de conteúdo por pull-to-refresh
- ℹ️ Tela Sobre o aplicativo
- 🔐 Acesso à Política de Privacidade
- 📧 Contato com o suporte
- 📱 Interface adaptada para dispositivos móveis

---

## 🏛️ Pontos de interesse

O aplicativo reúne diferentes tipos de atrativos da cidade, incluindo locais relacionados a:

- Natureza
- História
- Cultura
- Arte
- Lazer

Entre os locais cadastrados estão o **Complexo Turístico Mirante Ponte Estaiada**, **Parque Ambiental Encontro dos Rios**, **Parque da Cidadania**, **Theatro 4 de Setembro**, **Palácio de Karnak**, **Bioparque Zoobotânico**, **Polo Cerâmico do Poti Velho**, entre outros.

As informações dos locais podem ser atualizadas no banco de dados sem necessidade de publicar uma nova versão do aplicativo.

---

## 🛠️ Tecnologias utilizadas

### Aplicativo

- **React Native** — desenvolvimento da interface mobile.
- **Expo** — ferramentas de desenvolvimento e compilação do aplicativo.
- **Expo Router** — organização das telas e navegação.
- **TypeScript** — tipagem e manutenção do código.
- **AsyncStorage** — armazenamento local dos favoritos.
- **Expo Vector Icons** — ícones da interface.

### Backend

- **Supabase** — plataforma de backend.
  - **PostgreSQL** — armazenamento dos pontos turísticos, eventos e demais informações.
  - **Storage** — armazenamento de imagens.
  - **Row Level Security (RLS)** — políticas de controle de acesso aos dados.
  - **Edge Functions** — execução de funções para integração com serviços externos.

### Serviços externos

- **Google Maps** — abertura dos locais no mapa.
- **Google Places API (New)** — consulta de avaliações e informações públicas dos locais.

---

## 🧱 Arquitetura

O aplicativo utiliza uma arquitetura em que o frontend desenvolvido com React Native consome os dados armazenados no Supabase.

```text
Teresina Tour
│
├── React Native + Expo
│   ├── Explorar
│   ├── Eventos
│   ├── Favoritos
│   ├── Detalhes dos locais
│   ├── Detalhes dos eventos
│   └── Sobre o aplicativo
│
├── Supabase
│   ├── PostgreSQL
│   ├── Storage
│   ├── Row Level Security
│   └── Edge Functions
│
├── Google Maps
│
└── Google Places API (New)
```

O **Supabase** é responsável pelo armazenamento e gerenciamento dos pontos de interesse, categorias, eventos e imagens.

A integração com o **Google Maps** permite abrir os locais cadastrados diretamente no serviço, utilizando o Google Place ID quando disponível.

Para determinadas informações atualizadas dos locais, como avaliações, o aplicativo utiliza a **Google Places API (New)** por meio de uma **Supabase Edge Function**, evitando a exposição da chave privada da API no aplicativo.

---

## 📂 Estrutura do projeto

```text
Teresina-Tour/
│
├── assets/
│
├── docs/
│   └── privacidade/
│       ├── index.html
│       └── logo-teresina-tour.png
│
├── src/
│   ├── app/
│   │   ├── (tabs)/
│   │   │   ├── index.tsx
│   │   │   ├── favorites.tsx
│   │   │   └── events.tsx
│   │   │
│   │   ├── details/
│   │   ├── event-details/
│   │   ├── sobre.tsx
│   │   └── _layout.tsx
│   │
│   ├── components/
│   ├── contexts/
│   ├── hooks/
│   ├── lib/
│   └── types/
│
├── .gitignore
├── app.json
├── eas.json
├── package.json
├── package-lock.json
└── tsconfig.json
```

---

## ⚙️ Como executar

### Pré-requisitos

- Node.js
- npm
- Git
- Ambiente compatível com Expo

### 1. Clone o repositório

```bash
git clone https://github.com/ArthurJpeg/Teresina-Tour.git
cd Teresina-Tour
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
EXPO_PUBLIC_SUPABASE_URL=SUA_URL_DO_SUPABASE
EXPO_PUBLIC_SUPABASE_KEY=SUA_CHAVE_PUBLICA_DO_SUPABASE
```

Substitua os valores pelas credenciais públicas correspondentes ao projeto Supabase que será utilizado.

**Importante:** as variáveis com prefixo `EXPO_PUBLIC_` são incorporadas ao aplicativo e não devem conter segredos. Nunca utilize nelas chaves privadas, como a `service_role` do Supabase ou a chave privada da Google Places API.

O arquivo `.env` deve permanecer fora do controle de versão.

### 4. Inicie o projeto

```bash
npx expo start
```

O aplicativo poderá ser executado em um ambiente compatível com Expo ou por meio de uma build instalada em um dispositivo.

O funcionamento das consultas depende da disponibilidade e da configuração dos serviços externos utilizados.

---

## 🔐 Segurança

O projeto adota práticas para reduzir a exposição de informações sensíveis:

- O arquivo `.env` é ignorado pelo Git.
- A chave privada da Google Places API não fica armazenada no aplicativo.
- As consultas à Places API são intermediadas por uma Supabase Edge Function.
- O banco de dados utiliza políticas de Row Level Security (RLS).
- O aplicativo utiliza conexões HTTPS para comunicação com os serviços externos.

A chave pública utilizada pelo aplicativo para comunicação com o Supabase deve ter seu acesso limitado pelas políticas de segurança configuradas no backend.

---

## 🗺️ Google Maps e Places API

Cada ponto turístico pode possuir um **Google Place ID** associado.

Esse identificador permite abrir o local correspondente no Google Maps, facilitando o acesso às informações de localização e aos recursos de navegação do serviço.

A **Google Places API (New)** é utilizada separadamente para consultar determinadas informações públicas e atualizadas dos locais.

---

## 💾 Favoritos

Os pontos favoritados são armazenados localmente no dispositivo utilizando **AsyncStorage**.

Dessa forma, os favoritos permanecem disponíveis mesmo após fechar e abrir novamente o aplicativo.

O aplicativo não exige cadastro ou login para utilizar essa funcionalidade.

---

## 📅 Eventos

O aplicativo possui uma área dedicada aos eventos realizados em Teresina.

Os eventos são armazenados no Supabase e podem conter informações como:

- Nome
- Descrição
- Imagem
- Local
- Endereço
- Data e horário
- Link para ingresso
- Entrada gratuita ou paga
- Google Place ID

Isso permite atualizar a agenda sem precisar publicar uma nova versão do aplicativo.

---

## 🔏 Política de Privacidade

O Teresina Tour disponibiliza uma Política de Privacidade pública, acessível tanto pelo aplicativo quanto pelo navegador.

**[Consultar a Política de Privacidade](https://arthurjpeg.github.io/Teresina-Tour/privacidade/)**

O aplicativo não exige criação de conta e armazena os favoritos localmente. Serviços externos utilizados pelo projeto podem processar informações técnicas de conexão, conforme descrito na política.

---

## 🎓 Contexto acadêmico

O Teresina Tour foi desenvolvido como projeto de extensão do curso de **Bacharelado em Ciência da Computação da UNINASSAU**, relacionado à temática:

> **Cidades Inteligentes e Prototipagem de Soluções**

Além do desenvolvimento técnico, o projeto busca demonstrar como conhecimentos da Ciência da Computação podem ser utilizados na criação de soluções digitais relacionadas às necessidades da sociedade.

---

## 🎯 Objetivo

Centralizar e facilitar o acesso a informações sobre pontos turísticos, culturais, históricos, ambientais e de lazer de Teresina, contribuindo para a descoberta e valorização dos espaços e experiências disponíveis na cidade.

---

## 👥 Equipe

Projeto desenvolvido por:

- **Abner de Carvalho Dantas Nunes**
- **Antônio Henrique Santos Viana**
- **Arthur Moura Rocha**
- **Marcos Vinnícius Lustosa Rocha**
- **Victor Gabriell de Sousa Alencar**

Curso de **Bacharelado em Ciência da Computação — UNINASSAU**.

---

## 📧 Contato

Para dúvidas, suporte ou solicitações relacionadas ao aplicativo:

**afjcode@gmail.com**

---

## 📄 Licença

O projeto está disponibilizado sob a **Licença MIT**, conforme o arquivo `LICENSE` presente no repositório.

---

## 📌 Status do projeto

**Versão 1.0 — desenvolvimento concluído.**

As principais funcionalidades previstas para o projeto acadêmico estão implementadas, incluindo exploração de pontos de interesse, pesquisa, categorias, favoritos, eventos, integração com Google Maps, tela Sobre e atualização dinâmica de informações pelo Supabase.

**Publicação na Google Play Store:** em preparação, com etapas de compilação e testes de distribuição ainda pendentes.

---

<p align="center">
  <strong>Teresina Tour</strong><br>
  Descubra Teresina. Explore a cidade. 💛
</p>
