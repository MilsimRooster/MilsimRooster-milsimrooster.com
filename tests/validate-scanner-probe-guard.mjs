import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync("functions/_middleware.js", "utf8");

assert.match(source, /wp-admin/);
assert.match(source, /wp-content/);
assert.match(source, /cgi-bin/);
assert.match(source, /\\.php/);
assert.match(source, /_profiler/);
assert.match(source, /backend\\\/web\\\/debug/);
assert.match(source, /\\.env/);
assert.match(source, /@fs/);
assert.match(source, /\\.aws/);
assert.match(source, /id_ecdsa/);
assert.match(source, /__env/);
assert.match(source, /\\.map/);
assert.match(source, /composer/);
assert.match(source, /adminer/);
assert.match(source, /status:\s*410/);
assert.match(source, /context\.next\(\)/);

const blockedExamples = [
  "/wp-admin/",
  "/wp-content/plugins/hellopress/wp_filemanager.php",
  "/wp-content/plugins/index.php",
  "/cgi-bin/",
  "/info.php",
  "/alfa.php",
  "/debug.php",
  "/server-info.php",
  "/system-info.php",
  "/_profiler/phpinfo",
  "/backend/web/debug/default/view",
  "/admin/debug/default/view",
  "/.env",
  "/mailing/.env",
  "/smtp/.env",
  "/api/.env",
  "/.env.staging",
  "/aws/.env.production",
  "/.git/config",
  "/public../.aws/credentials",
  "/backend/.aws/credentials",
  "/@fs/.env",
  "/@fs/proc/self/environ",
  "/@fs/..%252f..%252f..%252f..%252f..%252froot/.env",
  "/id_ecdsa",
  "/.openai/config.json",
  "/.gitlab-ci.yml",
  "/api/config.json",
  "/config/prod.exs",
  "/__env.js",
  "/assets/main-BBhybtHL.js.map",
  "/assets/js/referrer-analytics.js.map",
  "/composer.json",
  "/package.json",
  "/wrangler.toml",
  "/schema.sql",
  "/backup.sql",
  "/site.zip",
  "/public_html.tar.gz",
  "/actuator/env",
  "/phpmyadmin/",
  "/pma/",
  "/adminer/",
  "/xmlrpc.php",
  "/wp-login.php"
];

const allowedExamples = [
  "/",
  "/about/",
  "/apps/apostles/new-testament-trail",
  "/apps/apostles/new-testament-trail.html",
  "/apps/recipes/admin.html",
  "/apps/bug-strike/src/core.js",
  "/assets/main-BBhybtHL.js",
  "/assets/js/referrer-analytics.js",
  "/apps/recipes/config.html",
  "/bible/kjv.json",
  "/media/archive/second-layer/img-1951.jpg"
];

const patterns = [
  /^\/.*\.(?:php|asp|aspx|cgi|jsp)$/i,
  /^\/(?:wp-admin|wp-content|wp-includes)(?:\/|$)/i,
  /^\/cgi-bin(?:\/|$)/i,
  /^\/(?:xmlrpc|wp-login)\.php$/i,
  /^\/(?:_profiler|backend\/web\/debug|admin\/debug|debug|server-status|server-info|system-info|phpinfo)(?:\/|$)/i,
  /^\/(?:.*\/)?\.env(?:[._-][a-z0-9-]+)?$/i,
  /^\/(?:.*\/)?(?:\.git|\.svn|\.hg|\.DS_Store)(?:\/|$)/i,
  /^\/(?:.*\/)?\.aws\/(?:config|credentials)$/i,
  /^\/@fs(?:\/|$)/i,
  /^\/(?:.*\/)?(?:id_rsa|id_dsa|id_ecdsa|id_ed25519|authorized_keys)$/i,
  /^\/(?:__env\.js|env\.js|config\.js)$/i,
  /^\/(?:api\/config\.json|config\/[a-z0-9_.-]+\.(?:exs|ini|json|toml|ya?ml)|\.openai\/config\.json|\.gitlab-ci\.ya?ml)$/i,
  /^\/.*\.map$/i,
  /^\/(?:composer\.(?:json|lock)|package(?:-lock)?\.json|yarn\.lock|pnpm-lock\.yaml|vite\.config\.mjs|webpack\.config\.js|wrangler\.toml|schema\.sql)$/i,
  /^\/(?:backup|database|db|dump|site|www|public_html|wordpress|wp|milsimrooster)(?:[-_.]?[a-z0-9]*)?\.(?:7z|bak|gz|old|rar|sql|tar|tgz|zip)$/i,
  /^\/(?:actuator|solr|phpmyadmin|pma|mysql|dbadmin|adminer)(?:\/|$)/i
];

const isScannerProbe = (pathname) => patterns.some((pattern) => pattern.test(pathname));

for (const path of blockedExamples) {
  assert.equal(isScannerProbe(path), true, `${path} should be blocked`);
}

for (const path of allowedExamples) {
  assert.equal(isScannerProbe(path), false, `${path} should stay allowed`);
}
