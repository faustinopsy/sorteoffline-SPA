<?php
/**
 * sitemap.php — Sitemap XML dinâmico.
 * Busca posts via API HTTP (sem dependência do config.php local).
 */

declare(strict_types=1);

while (ob_get_level()) ob_end_clean();
ob_start();

// ── Domínio do site (frontend) ────────────────────────────────────────────
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host     = $_SERVER['HTTP_HOST'] ?? 'lmania.com.br';
$domain   = "{$protocol}://{$host}";

// ── URL da API de blog ────────────────────────────────────────────────────
$isLocal  = in_array($host, ['localhost', '127.0.0.1'], true) || str_starts_with($host, 'localhost:');
$apiBase  = $isLocal ? 'http://localhost:8000' : 'https://api.lmania.com.br';

// ── Buscar posts via HTTP ─────────────────────────────────────────────────
$posts = [];
try {
    $ctx = stream_context_create([
        'http' => [
            'timeout'        => 5,
            'ignore_errors'  => true,
            'method'         => 'GET',
            'header'         => "Accept: application/json\r\nUser-Agent: LMania-Sitemap/1.0\r\n",
        ],
        'ssl' => [
            'verify_peer'      => true,
            'verify_peer_name' => true,
        ],
    ]);

    // Busca posts em PT (lingua principal)
    $json = file_get_contents("{$apiBase}/posts?lang=pt", false, $ctx);
    if ($json !== false) {
        $decoded = json_decode($json, true);
        if (is_array($decoded)) {
            $posts = array_merge($posts, $decoded);
        }
    }

    // Busca posts em EN para hreflang alternativo
    $jsonEn = file_get_contents("{$apiBase}/posts?lang=en", false, $ctx);
    if ($jsonEn !== false) {
        $decoded = json_decode($jsonEn, true);
        if (is_array($decoded)) {
            $posts = array_merge($posts, $decoded);
        }
    }
} catch (\Throwable $e) { /* Silencioso — sitemap continua sem posts */ }

// ── Cabeçalhos ───────────────────────────────────────────────────────────
header('Content-Type: text/xml; charset=utf-8');
header('X-Content-Type-Options: nosniff');

// ── XML ───────────────────────────────────────────────────────────────────
echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">' . "\n";

// Páginas estáticas
$static = [
    '/'             => ['freq' => 'weekly',  'priority' => '1.0'],
    '/blog'         => ['freq' => 'daily',   'priority' => '0.9'],
    '/mega-sena'    => ['freq' => 'monthly', 'priority' => '0.8'],
    '/lotofacil'    => ['freq' => 'monthly', 'priority' => '0.8'],
    '/quina'        => ['freq' => 'monthly', 'priority' => '0.8'],
    '/lotomania'    => ['freq' => 'monthly', 'priority' => '0.8'],
    '/sobre'        => ['freq' => 'monthly', 'priority' => '0.7'],
    '/privacidade'  => ['freq' => 'yearly',  'priority' => '0.5'],
    '/contato'      => ['freq' => 'yearly',  'priority' => '0.5'],
];

foreach ($static as $path => $meta) {
    echo "  <url>\n";
    echo "    <loc>{$domain}{$path}</loc>\n";
    echo "    <changefreq>{$meta['freq']}</changefreq>\n";
    echo "    <priority>{$meta['priority']}</priority>\n";
    echo "  </url>\n";
}

// Agrupa posts por slug → langs
$slugs = [];
foreach ($posts as $p) {
    $slug = $p['slug'] ?? '';
    $lang = $p['lang'] ?? 'pt';
    $date = $p['date'] ?? '';
    if ($slug === '') continue;
    $slugs[$slug][$lang] = $date;
}

foreach ($slugs as $slug => $langs) {
    // Emite apenas uma entrada por slug (idioma principal PT ou primeiro disponível)
    $primaryLang = $langs['pt'] ?? reset($langs);
    $date        = $primaryLang;
    $loc         = "{$domain}/blog/{$slug}";

    echo "  <url>\n";
    echo "    <loc>{$loc}</loc>\n";
    if ($date) echo "    <lastmod>{$date}</lastmod>\n";
    echo "    <changefreq>monthly</changefreq>\n";
    echo "    <priority>0.6</priority>\n";
    if (count($langs) > 1) {
        foreach (array_keys($langs) as $l) {
            echo "    <xhtml:link rel=\"alternate\" hreflang=\"{$l}\" href=\"{$loc}?lang={$l}\"/>\n";
        }
        echo "    <xhtml:link rel=\"alternate\" hreflang=\"x-default\" href=\"{$loc}\"/>\n";
    }
    echo "  </url>\n";
}

echo '</urlset>';

// Salvar fisicamente na raiz (para Google e CDNs estáticas)
$xml = ob_get_clean();
try {
    file_put_contents(__DIR__ . '/sitemap.xml', $xml);
} catch (\Throwable $e) { /* silencioso */ }

echo $xml;
exit;
