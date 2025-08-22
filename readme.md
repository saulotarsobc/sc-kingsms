## sc-kingsms

Cliente TypeScript para consumir a API da KingSMS usando axios.

### Instalação

```
npm install sc-kingsms
```

### Uso básico

```ts
import KingSMSClient from "sc-kingsms";

const client = new KingSMSClient({ login: "seulogin", token: "seutoken" });

// Enviar SMS
await client.sendSMS({ numero: "11999999999", msg: "teste" });

// Checar status
await client.checkStatus("189");

// Saldo
await client.getAmount();
```

Parâmetros suportados em sendSMS: numero (string ou string[]), msg, campanha?, data? (DD-MM-YYYY), hora? (HH:mm).

### Build local

```
npm run build
```

### Testes

Rodar a suíte de testes com Vitest:

```
npm run test
```

Assistir em modo watch:

```
npm run test:watch
```

Gerar cobertura de código:

```
npm run coverage
```

### Testes de integração (reais)

Há testes que chamam a API real usando variáveis do arquivo `.env`:

```
KING_SMS_USER=user
KING_SMS_TOKEN=token
KING_SMS_TO=phone_number
```

Para rodar os testes de integração sem envio de SMS (saldo e conexões):

```
npm run test:int
```

Para incluir o envio de SMS real (pode gerar custo), ative explicitamente:

```
npm run test:int:send
```

### Publicação

Atualize a versão no package.json e publique:

```
npm publish --access public
```
