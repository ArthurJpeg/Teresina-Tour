# 🌆 Teresina Tour

Aplicativo mobile desenvolvido para facilitar a descoberta de pontos turísticos, culturais, históricos, ambientais e de lazer da cidade de **Teresina - PI**, reunindo informações relevantes sobre os locais e eventos da capital em uma única plataforma.

O projeto foi desenvolvido como parte de um projeto de extensão do curso de **Ciência da Computação**, dentro da temática **Cidades Inteligentes e Prototipagem de Soluções**.

---

## 📱 Sobre o projeto

O **Teresina Tour** surgiu com a proposta de centralizar informações que podem estar distribuídas em diferentes fontes, facilitando a descoberta de locais e atividades disponíveis na cidade.

Por meio do aplicativo, o usuário pode explorar pontos de interesse de Teresina, pesquisar locais, filtrar por categorias, consultar informações detalhadas, salvar favoritos, visualizar eventos e acessar a localização dos pontos através do Google Maps.

---

## ✨ Funcionalidades

- 🔎 Pesquisa de pontos de interesse
- 🗂️ Filtragem por categorias
- 📍 Informações detalhadas dos locais
- 🖼️ Imagens dos pontos turísticos
- 🕐 Horários de funcionamento
- ⭐ Consulta de avaliações dos locais
- 🗺️ Integração com Google Maps
- ❤️ Sistema de favoritos com persistência local
- 📅 Agenda de eventos de Teresina
- 🔎 Pesquisa de eventos
- 🔄 Atualização de conteúdo por pull-to-refresh
- 📱 Interface responsiva para dispositivos móveis

---

## 🏛️ Pontos de interesse

O aplicativo reúne diferentes tipos de atrativos da cidade, incluindo locais relacionados a:

- Natureza
- História
- Cultura
- Arte
- Lazer

Entre os locais cadastrados estão o **Complexo Turístico Mirante Ponte Estaiada**, **Parque Ambiental Encontro dos Rios**, **Parque da Cidadania**, **Theatro 4 de Setembro**, **Palácio de Karnak**, **Bioparque Zoobotânico**, **Polo Cerâmico do Poti Velho**, entre outros.

---

## 🛠️ Tecnologias utilizadas

### Aplicativo

- **React Native**
- **Expo**
- **Expo Router**
- **TypeScript**
- **AsyncStorage**
- **Expo Vector Icons**

### Backend

- **Supabase**
  - PostgreSQL
  - Storage
  - Row Level Security (RLS)
  - Edge Functions

### Serviços externos

- **Google Maps**
- **Google Places API (New)**

---

## 🧱 Arquitetura

O aplicativo utiliza uma arquitetura em que o frontend desenvolvido com React Native consome os dados armazenados no Supabase.

```text
Teresina Tour
│
├── React Native + Expo
│       │
│       ├── Explorar
│       ├── Favoritos
│       ├── Eventos
│       └── Detalhes
│
├── Supabase
│       │
│       ├── PostgreSQL
│       ├── Storage
│       ├── Row Level Security
│       └── Edge Functions
│
├── Google Maps
│
└── Google Places API (New)
```

O **Supabase** é responsável pelo armazenamento e gerenciamento dos pontos de interesse, categorias, eventos e imagens.

A integração com o **Google Maps** permite abrir os locais cadastrados diretamente no serviço utilizando o Google Place ID.

Para determinadas informações atualizadas dos estabelecimentos, como avaliações, o aplicativo utiliza a **Places API (New)** através de uma **Supabase Edge Function**, evitando a exposição da chave privada da API no aplicativo.

---

## 📂 Estrutura do projeto

```text
Teresina-Tour/
│
├── assets/
│
├── src/
│   ├── app/
│   │   ├── (tabs)/
│   │   │   ├── index.tsx
│   │   │   ├── favorites.tsx
│   │   │   └── events.tsx
│   │   │
│   │   ├── details/
│   │   └── event-details/
│   │
│   ├── components/
│   ├── contexts/
│   ├── hooks/
│   ├── lib/
│   └── types/
│
├── .env.example
├── app.json
├── eas.json
├── package.json
├── package-lock.json
└── tsconfig.json
```

---

## ⚙️ Como executar

### Pré-requisitos

Antes de começar, tenha instalado:

- Node.js
- npm
- Expo
- Git

### 1. Clone o repositório

```bash
git clone https://github.com/ArthurJpeg/Teresina-Tour.git
```

Entre na pasta:

```bash
cd Teresina-Tour
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto utilizando o `.env.example` como referência:

```env
EXPO_PUBLIC_SUPABASE_URL=SUA_URL_DO_SUPABASE
EXPO_PUBLIC_SUPABASE_KEY=SUA_CHAVE_PUBLICA_DO_SUPABASE
```

> O arquivo `.env` não deve ser enviado ao GitHub.

### 4. Inicie o projeto

```bash
npx expo start
```

O aplicativo poderá ser executado utilizando um ambiente compatível com Expo ou uma build instalada em um dispositivo.

---

## 🔐 Segurança

O projeto utiliza algumas práticas para evitar a exposição de informações sensíveis:

- Variáveis de ambiente não são versionadas;
- O arquivo `.env` está incluído no `.gitignore`;
- A chave privada da Google Places API não fica armazenada no aplicativo;
- Requisições à Places API são intermediadas por uma Supabase Edge Function;
- O banco de dados utiliza políticas de **Row Level Security (RLS)**.

A chave pública utilizada pelo aplicativo para comunicação com o Supabase possui acesso limitado pelas políticas configuradas no banco.

---

## 🗺️ Google Maps e Places API

Cada ponto turístico pode possuir um **Google Place ID** associado.

Esse identificador é utilizado para abrir o local correspondente no Google Maps, permitindo ao usuário utilizar os recursos do serviço para auxiliar no deslocamento até o destino.

A **Google Places API (New)** é utilizada separadamente para consultar determinadas informações atualizadas dos locais.

---

## 💾 Favoritos

Os pontos favoritados são armazenados localmente no dispositivo utilizando **AsyncStorage**.

Dessa forma, os favoritos permanecem disponíveis mesmo após fechar e abrir novamente o aplicativo.

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

## 🎓 Contexto acadêmico

O Teresina Tour foi desenvolvido como projeto de extensão do curso de **Bacharelado em Ciência da Computação**, relacionado à temática:

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

Curso de **Bacharelado em Ciência da Computação**.

---

## 📄 Licença

Este projeto possui arquivo de licença disponível no repositório.

---

## 📌 Status do projeto

**Versão 1.0 concluída.**

O aplicativo conta com as principais funcionalidades previstas para o projeto, incluindo exploração de pontos de interesse, pesquisa, categorias, favoritos, eventos, integração com Google Maps e atualização dinâmica de informações através do Supabase.

---

<p align="center">
  <strong>Teresina Tour</strong><br>
  Descubra Teresina. Explore a cidade. 💛
</p>
