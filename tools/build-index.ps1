param(
  [string]$Template = "src/index.template.html",
  [string]$Output = "index.html"
)

$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$templatePath = Join-Path $root $Template
$outputPath = Join-Path $root $Output

if (-not (Test-Path -LiteralPath $templatePath)) {
  throw "Template not found: $Template"
}

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$content = [System.IO.File]::ReadAllText($templatePath, $utf8NoBom)

function Get-DotEnvValue {
  param(
    [string]$Name
  )

  $envPaths = @(
    (Join-Path $root ".env"),
    (Join-Path $root "docs/.env")
  )

  foreach ($envPath in $envPaths) {
    if (-not (Test-Path -LiteralPath $envPath)) {
      continue
    }

    $lines = [System.IO.File]::ReadAllLines($envPath, $utf8NoBom)
    foreach ($line in $lines) {
      $trimmed = $line.Trim()
      if (-not $trimmed -or $trimmed.StartsWith("#")) {
        continue
      }

      $match = [regex]::Match($trimmed, "^\s*" + [regex]::Escape($Name) + "\s*=\s*(.*)\s*$")
      if ($match.Success) {
        return $match.Groups[1].Value.Trim().Trim('"').Trim("'")
      }
    }
  }

  return ""
}

$content = [regex]::Replace($content, "(?m)^[ \t]*<!--\s*@include\s+([^>]+?)\s*-->[ \t]*\r?$", {
  param($match)

  $relativePath = $match.Groups[1].Value.Trim()
  $includePath = Join-Path $root $relativePath

  if (-not (Test-Path -LiteralPath $includePath)) {
    throw "Include not found: $relativePath"
  }

  [System.IO.File]::ReadAllText($includePath, $utf8NoBom).TrimEnd()
})

$gaMeasurementId = Get-DotEnvValue "GA_MEASUREMENT_ID"
if ($gaMeasurementId -and $gaMeasurementId -match "^G-[A-Z0-9]+$") {
  $content = $content -replace 'window\.VITALRISE_GA_ID\s*=\s*"";', ('window.VITALRISE_GA_ID = "' + $gaMeasurementId + '";')
}

[System.IO.File]::WriteAllText($outputPath, $content.TrimEnd() + [Environment]::NewLine, $utf8NoBom)
Write-Host "Built $Output from $Template"
