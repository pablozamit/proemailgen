# Instrucciones para subir a GitHub

## Método 1: Usando GitHub Codespaces o VS Code Web

1. Ve a GitHub.com y crea un nuevo repositorio:
   - Nombre: `email-generator-pro`
   - Descripción: `Generador profesional de emails copywriter con IA`
   - Público o privado según prefieras
   - NO agregues README ni .gitignore

2. Una vez creado el repo, haz clic en "Code" → "Codespaces" → "Create codespace"

3. En el terminal de Codespaces, clona tu proyecto desde Replit:
```bash
git clone https://github.com/replit/@TU_USUARIO_REPLIT/ProfessionalEmailGenerator.git temp
cd temp
cp -r * ../
cd ..
rm -rf temp
```

4. Configura el repositorio:
```bash
git init
git add .
git commit -m "Initial commit - Email Generator Pro"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/email-generator-pro.git
git push -u origin main
```

## Método 2: URL directa de Replit

Tu proyecto en Replit está en una URL como:
`https://replit.com/@TU_USUARIO/ProfessionalEmailGenerator`

Puedes importar directamente desde GitHub:

1. En GitHub, al crear el repo, en lugar de subirlo, usa "Import a repository"
2. Usa la URL de tu Replit como fuente
3. GitHub importará automáticamente todo el código

## Método 3: Compartir desde Replit

1. En Replit, haz clic en "Share" (arriba a la derecha)
2. Conecta tu cuenta de GitHub si no lo has hecho
3. Publica directamente como repositorio público

¿Cuál de estos métodos prefieres intentar?