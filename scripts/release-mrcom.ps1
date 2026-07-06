param(
    [switch]$SkipDeploy,
    [switch]$SkipLiveCheck
)

$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

function Run-Step {
    param(
        [string]$Name,
        [scriptblock]$Command
    )

    Write-Host ""
    Write-Host "== $Name =="
    & $Command
}

Run-Step "Validate site and hosted apps" {
    npm run check
}

Run-Step "Build production bundle" {
    npm run build
}

if (-not $SkipDeploy) {
    Run-Step "Deploy Cloudflare Pages Direct Upload" {
        npx wrangler pages deploy dist --project-name milsimrooster-com --branch main
    }
}
else {
    Write-Host ""
    Write-Host "== Deploy Cloudflare Pages Direct Upload =="
    Write-Host "Skipped because -SkipDeploy was provided."
}

if (-not $SkipLiveCheck) {
    $routes = @(
        "https://milsimrooster.com/",
        "https://milsimrooster.com/apps/gallery/",
        "https://milsimrooster.com/apps/bible-study/",
        "https://milsimrooster.com/apps/apostles/",
        "https://milsimrooster.com/apps/apostles/new-testament-trail.html",
        "https://milsimrooster.com/apps/bug-strike/",
        "https://milsimrooster.com/apps/fps-visualizer/",
        "https://milsimrooster.com/apps/how-southern-are-you/",
        "https://milsimrooster.com/apps/quotetron/",
        "https://milsimrooster.com/apps/recipes/",
        "https://milsimrooster.com/apps/southern-translator/"
    )

    Run-Step "Check live routes" {
        foreach ($route in $routes) {
            try {
                $response = Invoke-WebRequest -Uri $route -Method Head -UseBasicParsing -TimeoutSec 20
                "{0} {1}" -f [int]$response.StatusCode, $route
            }
            catch {
                throw "Live route check failed for ${route}: $($_.Exception.Message)"
            }
        }
    }
}
else {
    Write-Host ""
    Write-Host "== Check live routes =="
    Write-Host "Skipped because -SkipLiveCheck was provided."
}

Write-Host ""
Write-Host "MR.com release path complete."
