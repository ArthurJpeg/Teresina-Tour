# Teresina Tour

O **Teresina Tour** é um aplicativo mobile desenvolvido para facilitar a descoberta de pontos turísticos e eventos da cidade de **Teresina - PI**.

O aplicativo reúne informações sobre locais turísticos da cidade, como descrição, endereço, horário de funcionamento e localização, além de apresentar eventos que estão acontecendo em Teresina.

## Principais funcionalidades

- Exploração de pontos turísticos de Teresina;
- Pesquisa por nome;
- Filtro por categorias;
- Informações detalhadas sobre cada ponto turístico;
- Integração com Google Maps;
- Avaliações de locais através do Google Places;
- Sistema de favoritos;
- Favoritos salvos no dispositivo;
- Consulta de eventos da cidade;
- Informações detalhadas sobre eventos;
- Compatibilidade com Android e iOS.

## Tecnologias utilizadas

O aplicativo foi desenvolvido principalmente com:

- **React Native**
- **Expo**
- **TypeScript**
- **Expo Router**
- **Supabase**
- **PostgreSQL**
- **AsyncStorage**
- **Google Maps**
- **Google Places API**

O Supabase é utilizado como backend da aplicação, fornecendo o banco de dados PostgreSQL e outros serviços utilizados pelo projeto.

---

# Como executar o projeto no computador

## 1. Instalar o Node.js

É necessário possuir o **Node.js** instalado no computador.

Após a instalação, abra o PowerShell ou terminal e verifique:

```bash
node --version
```

Também verifique o npm:

```bash
npm --version
```

Se os dois comandos mostrarem suas respectivas versões, a instalação foi realizada corretamente.

---

## 2. Baixar o projeto

Na página deste repositório no GitHub, clique em:

**Code → Download ZIP**

Extraia o arquivo ZIP para uma pasta do computador.

Outra opção, para quem utiliza Git, é:

```bash
git clone URL_DO_REPOSITORIO
```

Depois, entre na pasta do projeto:

```bash
cd Teresina-Tour
```

---

## 3. Instalar as dependências

Dentro da pasta do projeto, execute:

```bash
npm install
```

O npm utilizará os arquivos `package.json` e `package-lock.json` para instalar as bibliotecas necessárias.

A pasta `node_modules` será criada automaticamente.

---

## 4. Configurar o Supabase

O projeto precisa de duas variáveis para se comunicar com o Supabase.

Na raiz do projeto existe o arquivo:

```text
.env.example
```

Crie uma cópia dele chamada:

```text
.env
```

O arquivo deverá possuir:

```env
EXPO_PUBLIC_SUPABASE_URL=SUA_URL_DO_SUPABASE
EXPO_PUBLIC_SUPABASE_KEY=SUA_CHAVE_PUBLICA_DO_SUPABASE
```

Substitua os valores pelos dados do projeto Supabase do Teresina Tour.

> O arquivo `.env` não deve ser enviado para o GitHub.

Caso você faça parte da equipe do projeto e não possua esses dados, solicite-os ao responsável pelo backend.

---

## 5. Iniciar o Teresina Tour

Depois de instalar as dependências e configurar o `.env`, execute:

```bash
npx expo start
```

O Expo iniciará o servidor de desenvolvimento e mostrará as opções disponíveis para executar o aplicativo.

---

## 6. Visualizar no celular

A maneira mais simples de visualizar o projeto é utilizando o aplicativo **Expo Go**.

Com o Expo Go instalado no celular, conecte o computador e o celular à mesma rede Wi-Fi.

Depois de executar:

```bash
npx expo start
```

escaneie o QR Code apresentado pelo Expo.

O Teresina Tour será carregado no dispositivo.

### Android

O QR Code pode ser escaneado diretamente pelo Expo Go.

### iPhone

O QR Code pode ser escaneado utilizando a câmera do iPhone e aberto no Expo Go.

---

# Estrutura básica

```text
Teresina-Tour/
│
├── assets/              # Recursos utilizados pelo aplicativo
├── src/                 # Código-fonte
│   ├── app/             # Telas e navegação
│   ├── components/      # Componentes reutilizáveis
│   ├── contexts/        # Contextos da aplicação
│   ├── hooks/           # Lógica de consulta e manipulação de dados
│   ├── lib/             # Configuração de serviços
│   └── types/           # Tipagens TypeScript
│
├── .env.example         # Modelo das variáveis de ambiente
├── app.json             # Configuração do Expo
├── eas.json             # Configuração de builds
├── package.json         # Dependências e scripts
└── tsconfig.json        # Configuração do TypeScript
```

---

## Resumo para executar

Para quem já possui o ambiente configurado:

```bash
npm install
npx expo start
```

Certifique-se apenas de criar e configurar o arquivo `.env` antes de iniciar o aplicativo.

---

## Teresina Tour

Projeto desenvolvido com o objetivo de reunir informações turísticas e eventos de Teresina em uma experiência mobile simples e acessível.
