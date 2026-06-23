# Deploy rápido e gratuito

Arquitetura recomendada:

- Backend: Render
- Frontend: Vercel
- Banco: MongoDB Atlas M0 gratuito
- Uploads de imagem/vídeo: Cloudinary gratuito

## 1. Suba este projeto no GitHub

Crie um repositório no GitHub e envie todos os arquivos desta pasta.

## 2. MongoDB Atlas

1. Crie um cluster gratuito M0.
2. Crie um usuário e senha do banco.
3. Em Network Access, libere temporariamente `0.0.0.0/0`.
4. Copie a connection string.

## 3. Backend no Render

New > Web Service > conecte o GitHub.

Configuração:

- Root Directory: `backend`
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn server:app --host 0.0.0.0 --port $PORT`

Variáveis obrigatórias no Render:

```env
MONGO_URL=mongodb+srv://USUARIO:SENHA@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
DB_NAME=mateusbuarque
JWT_SECRET=troque-por-uma-chave-grande-aleatoria
ADMIN_EMAIL=seuemail@gmail.com
ADMIN_PASSWORD=uma-senha-forte
CORS_ORIGINS=https://SEU-FRONTEND.vercel.app,https://mateusbuarque.com.br,https://www.mateusbuarque.com.br
APP_NAME=mateusbuarque
```

Depois do deploy, teste:

```
https://SEU-BACKEND.onrender.com/api/site-settings
```

## 4. Frontend na Vercel

New Project > importe o mesmo GitHub.

Configuração:

- Root Directory: `frontend`
- Framework: Create React App
- Build Command: `npm run build`
- Output Directory: `build`

Variável obrigatória na Vercel:

```env
REACT_APP_BACKEND_URL=https://SEU-BACKEND.onrender.com
```

Depois, redeploy.

## 5. Cloudinary para uploads

Crie uma conta gratuita e coloque no Render:

```env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Sem Cloudinary, o site abre, mas upload de imagem/vídeo pode falhar.

## 6. Domínio

Na Vercel, vá em Project > Settings > Domains e adicione:

```
mateusbuarque.com.br
www.mateusbuarque.com.br
```

No Registro.br, ajuste o DNS conforme a Vercel mostrar.

Depois atualize o `CORS_ORIGINS` no Render com os domínios finais.
