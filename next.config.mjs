// Importando a configuração do usuário com a sintaxe do ES Modules
let userConfig = undefined;
try {
  // Usando a sintaxe de importação dinâmica
  userConfig = await import('./v0-user-next.config.mjs');
} catch (e) {
  // Ignorando o erro caso o arquivo não exista
  // console.error('Erro ao carregar a configuração do usuário:', e);
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
};

// Função de mesclagem da configuração do Next.js com a configuração do usuário
mergeConfig(nextConfig, userConfig);

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) {
    return;
  }

  for (const key in userConfig) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfig[key],
      };
    } else {
      nextConfig[key] = userConfig[key];
    }
  }
}

// Exportando a configuração para o Next.js
export default nextConfig;
