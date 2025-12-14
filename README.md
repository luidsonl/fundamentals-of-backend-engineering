# WebSocket Chat

Este projeto é uma aplicação de chat em tempo real que utiliza WebSockets para comunicação entre os usuários. Os arquivos da aplicação React são servidos via Express.

## Como Funciona
Cada usuário pode escolher um nome de usuário e uma sala. As salas são isoladas, e o WebSocket transmite mensagens apenas para os usuários que estão na mesma sala. O gerenciamento do estado é feito utilizando o Context API do React, que integra com o WebSocket para facilitar a comunicação.

## Como Rodar Localmente
1. **Clone o repositório**:
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd websocket-chat
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Build a aplicação React**:
   ```bash
   npm run build
   ```

4. **Inicie o servidor**:
   ```bash
   npm start
   ```

5. **Abra o navegador** e acesse `http://localhost:3000` para ver a aplicação em funcionamento.
