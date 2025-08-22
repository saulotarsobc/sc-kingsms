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
await client.getAmont();
```

Parâmetros suportados em sendSMS: numero (string ou string[]), msg, campanha?, data? (DD-MM-YYYY), hora? (HH:mm).

### Build local

```
npm run build
```

### Publicação

Atualize a versão no package.json e publique:

```
npm publish --access public
```
