<?php
/**
 * router.php — Roteador para o servidor de desenvolvimento PHP embutido.
 *
 * Uso: php -S localhost:5500 router.php
 *      (executar na raiz do projeto l-mania)
 *
 * Lógica:
 *  1. Se a requisição for para /sitemap.xml → executar sitemap.php
 *  2. Se a requisição for para /api/*       → executar api/index.php
 *  3. Se o arquivo físico existir           → servir diretamente (HTML/CSS/JS/img)
 *  4. Qualquer outra URL                    → servir index.html (SPA fallback)
 */

declare(strict_types=1);

$uri  = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$root = __DIR__;

// ── 2. /api/* → backend PHP ─────────────────────────────────────────────
if (str_starts_with($uri, '/api/')) {
    // Mudar cwd para o diretório da api para que os require_once internos funcionem
    chdir($root . '/api');
    require $root . '/api/index.php';
    return true;
}

// ── 3. Arquivo estático real → servir ────────────────────────────────────
$file = $root . $uri;
if ($uri !== '/' && file_exists($file) && !is_dir($file)) {
    // Definir Content-Type correto para assets comuns
    $ext  = strtolower(pathinfo($file, PATHINFO_EXTENSION));
    $mime = match ($ext) {
        'html'  => 'text/html; charset=utf-8',
        'css'   => 'text/css; charset=utf-8',
        'js'    => 'application/javascript; charset=utf-8',
        'json'  => 'application/json; charset=utf-8',
        'png'   => 'image/png',
        'jpg',
        'jpeg'  => 'image/jpeg',
        'webp'  => 'image/webp',
        'svg'   => 'image/svg+xml',
        'ico'   => 'image/x-icon',
        'woff2' => 'font/woff2',
        'woff'  => 'font/woff',
        'ttf'   => 'font/ttf',
        'webmanifest',
        'manifest' => 'application/manifest+json; charset=utf-8',
        default => 'application/octet-stream',
    };
    header('Content-Type: ' . $mime);
    readfile($file);
    return true;
}

// ── 4. SPA fallback → index.html ────────────────────────────────────────
// ── 4. Segurança para ativos (MIME errors) ──────────────────────────────
// Se a URL parece um arquivo (tem .) mas não existe, 404 real.
// Isso evita que o navegador tente ler index.html como se fosse um .js
if (strpos($uri, '.') !== false && !file_exists($file)) {
    http_response_code(404);
    echo "404 - Not Found: {$uri}";
    return true;
}

// ── 5. SPA fallback → index.html ────────────────────────────────────────
// Qualquer rota virtual (/mega-sena, /blog/post, etc.) serve index.html
require $root . '/index.html';
return true;
