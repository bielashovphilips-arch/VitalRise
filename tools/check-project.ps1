$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $root

$failures = New-Object System.Collections.Generic.List[string]

function Add-Failure([string]$message) {
  $script:failures.Add($message) | Out-Null
}

function Get-FileText([string]$path) {
  return Get-Content -Encoding UTF8 -Raw -Path $path
}

$htmlFiles = Get-ChildItem -Path $root -Filter "*.html" -File | ForEach-Object { $_.FullName }
$htmlPath = Join-Path $root "index.html"
$html = Get-FileText $htmlPath
$htmlDocuments = @{}
foreach ($file in $htmlFiles) {
  $htmlDocuments[$file] = Get-FileText $file
}
$allHtml = ($htmlDocuments.Values) -join "`n"
$jsFiles = @(
  Join-Path $root "assets/js/script.js"
) + (Get-ChildItem -Path (Join-Path $root "assets/js/modules") -Filter "*.js" -File -ErrorAction SilentlyContinue | ForEach-Object { $_.FullName })

$allJs = ($jsFiles | ForEach-Object { Get-FileText $_ }) -join "`n"

$i18nPath = Join-Path $root "assets/js/modules/i18n.js"
if (Test-Path $i18nPath) {
  $i18nText = Get-FileText $i18nPath
  $i18nKeys = [regex]::Matches($allHtml, 'data-i18n(?:-placeholder)?="([^"]+)"') | ForEach-Object {
    $_.Groups[1].Value
  } | Sort-Object -Unique

  foreach ($key in $i18nKeys) {
    $quotedKeyPattern = '"' + [regex]::Escape($key) + '"\s*:'
    $bareKeyPattern = '(?m)^\s*' + [regex]::Escape($key) + '\s*:'
    if ($i18nText -notmatch $quotedKeyPattern -and $i18nText -notmatch $bareKeyPattern) {
      Add-Failure "Missing i18n key in assets/js/modules/i18n.js: $key"
    }
  }
}

$allIds = New-Object System.Collections.Generic.List[string]
foreach ($file in $htmlFiles) {
  $fileHtml = $htmlDocuments[$file]
  $ids = [regex]::Matches($fileHtml, 'id="([^"]+)"') | ForEach-Object { $_.Groups[1].Value }
  foreach ($id in $ids) {
    $allIds.Add($id) | Out-Null
  }

  $duplicateIds = $ids | Group-Object | Where-Object { $_.Count -gt 1 }
  foreach ($duplicate in $duplicateIds) {
    Add-Failure "Duplicate id in $([System.IO.Path]::GetFileName($file)): $($duplicate.Name) appears $($duplicate.Count)x"
  }
}

$htmlIdSet = $allIds | Sort-Object -Unique
$jsIdRefs = [regex]::Matches($allJs, 'getElementById\("([^"]+)"\)|\$\("([^"]+)"\)') | ForEach-Object {
  if ($_.Groups[1].Value) { $_.Groups[1].Value } else { $_.Groups[2].Value }
} | Sort-Object -Unique

$optionalIds = @(
  "command-calories",
  "command-body",
  "command-focus",
  "command-goal",
  "command-labs",
  "command-readiness",
  "command-training"
)

foreach ($id in $jsIdRefs) {
  if ($htmlIdSet -notcontains $id -and $optionalIds -notcontains $id) {
    Add-Failure "JS references missing id: $id"
  }
}

function Test-LocalReference([string]$sourceFile, [string]$rawRef) {
  $cleanRef = $rawRef.Split("?")[0]
  if (-not $cleanRef -or $cleanRef -match "^(https?:|mailto:|tel:|javascript:)") {
    return
  }

  $parts = $cleanRef.Split("#", 2)
  $pathPart = $parts[0]
  $anchorPart = if ($parts.Count -gt 1) { $parts[1] } else { "" }
  $targetPath = if ($pathPart) { Join-Path $root $pathPart } else { $sourceFile }

  if ($pathPart -and -not (Test-Path -LiteralPath $targetPath)) {
    Add-Failure "Missing local reference: $rawRef"
    return
  }

  if ($anchorPart) {
    $targetHtml = if ($htmlDocuments.ContainsKey($targetPath)) {
      $htmlDocuments[$targetPath]
    } elseif (Test-Path -LiteralPath $targetPath) {
      Get-FileText $targetPath
    } else {
      ""
    }

    if ($targetHtml -and $targetHtml -notmatch ('id="' + [regex]::Escape($anchorPart) + '"')) {
      Add-Failure "Missing anchor reference: $rawRef"
    }
  }
}

foreach ($file in $htmlFiles) {
  $fileHtml = $htmlDocuments[$file]
  $localRefs = [regex]::Matches($fileHtml, '(?:href|src)="([^"]+)"') | ForEach-Object {
    $_.Groups[1].Value
  } | Sort-Object -Unique

  foreach ($ref in $localRefs) {
    Test-LocalReference $file $ref
  }
}

foreach ($file in $htmlFiles) {
  $fileHtml = $htmlDocuments[$file]
  $formControlIds = [regex]::Matches($fileHtml, '<(?:input|select|textarea)[^>]*id="([^"]+)"') | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique
  $labelFors = [regex]::Matches($fileHtml, '<label[^>]*for="([^"]+)"') | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique
  foreach ($controlId in $formControlIds) {
    if ($labelFors -notcontains $controlId) {
      Add-Failure "Form control without label in $([System.IO.Path]::GetFileName($file)): $controlId"
    }
  }
}

$debugScanPaths = $htmlFiles + $jsFiles
$debugMatches = Select-String -Path $debugScanPaths -Pattern "console\.log|debugger|TODO|FIXME|alert\(" -AllMatches
foreach ($match in $debugMatches) {
  Add-Failure "Debug marker in $($match.Path):$($match.LineNumber)"
}

foreach ($file in $htmlFiles) {
  $fileHtml = $htmlDocuments[$file]
  $numberInputs = [regex]::Matches($fileHtml, '<input[^>]+type="number"[^>]*>') | ForEach-Object { $_.Value }
  foreach ($input in $numberInputs) {
    $idMatch = [regex]::Match($input, 'id="([^"]+)"')
    $id = if ($idMatch.Success) { $idMatch.Groups[1].Value } else { $input }

    if ($input -notmatch '\smin=') { Add-Failure "Number input missing min in $([System.IO.Path]::GetFileName($file)): $id" }
    if ($input -notmatch '\smax=') { Add-Failure "Number input missing max in $([System.IO.Path]::GetFileName($file)): $id" }
    if ($input -notmatch '\sstep=') { Add-Failure "Number input missing step in $([System.IO.Path]::GetFileName($file)): $id" }
  }
}

$nutritionModulePath = Join-Path $root "assets/js/modules/nutrition.js"
if (Test-Path $nutritionModulePath) {
  $nutritionModule = Get-FileText $nutritionModulePath
  $foodIds = [regex]::Matches($nutritionModule, 'id:\s*"([^"]+)"') | ForEach-Object { $_.Groups[1].Value }
  $duplicateFoodIds = $foodIds | Group-Object | Where-Object { $_.Count -gt 1 }

  foreach ($duplicate in $duplicateFoodIds) {
    Add-Failure "Duplicate nutrition food id: $($duplicate.Name) appears $($duplicate.Count)x"
  }

  $defaultSelectionMatch = [regex]::Match($nutritionModule, 'const defaultSelection = \{(?<body>[\s\S]*?)\};')
  if ($defaultSelectionMatch.Success) {
    $defaultIds = [regex]::Matches($defaultSelectionMatch.Groups["body"].Value, '"([^"]+)"') | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique
    $foodIdSet = $foodIds | Sort-Object -Unique

    foreach ($defaultId in $defaultIds) {
      if ($foodIdSet -notcontains $defaultId) {
        Add-Failure "Default nutrition selection references missing food id: $defaultId"
      }
    }
  }

  $foodsArrayMatch = [regex]::Match($nutritionModule, 'const foods = \[(?<body>[\s\S]*?)\];')
  if ($foodsArrayMatch.Success) {
    $foodBlocks = [regex]::Matches($foodsArrayMatch.Groups["body"].Value, '\{[\s\S]*?\n\s*\}')

    foreach ($foodBlock in $foodBlocks) {
      $block = $foodBlock.Value
      $idMatch = [regex]::Match($block, 'id:\s*"([^"]+)"')
      $foodLabel = if ($idMatch.Success) { $idMatch.Groups[1].Value } else { "(missing id)" }

      foreach ($fieldName in @("id", "name", "category", "unitType", "unitLabel", "portionStep", "min", "max")) {
        if ($block -notmatch "$fieldName\s*:") {
          Add-Failure "Nutrition food missing ${fieldName}: $foodLabel"
        }
      }

      if ($block -notmatch "macrosPer100\s*:" -and $block -notmatch "macrosPerUnit\s*:") {
        Add-Failure "Nutrition food missing macros: $foodLabel"
      }
    }
  }
}

$expectedModules = @(
  @{ Path = "assets/js/modules/system.js"; Export = "window.VitalRiseSystem.$" },
  @{ Path = "assets/js/modules/storage.js"; Export = "system.storage" },
  @{ Path = "assets/js/modules/print.js"; Export = "system.initPrint" },
  @{ Path = "assets/js/modules/calculator-shell.js"; Export = "system.calculatorShell" },
  @{ Path = "assets/js/modules/reveal.js"; Export = "system.initReveal" },
  @{ Path = "assets/js/modules/dashboard.js"; Export = "system.initDashboard" },
  @{ Path = "assets/js/modules/nutrition-custom.js"; Export = "system.nutritionCustom" },
  @{ Path = "assets/js/modules/nutrition.js"; Export = "system.nutrition" },
  @{ Path = "assets/js/modules/nutrition-render.js"; Export = "system.nutritionRender" },
  @{ Path = "assets/js/modules/training.js"; Export = "system.training" },
  @{ Path = "assets/js/modules/training-templates.js"; Export = "system.trainingTemplates" },
  @{ Path = "assets/js/modules/training-guidance.js"; Export = "system.trainingGuidance" },
  @{ Path = "assets/js/modules/training-progression.js"; Export = "system.trainingProgression" },
  @{ Path = "assets/js/modules/training-render.js"; Export = "system.trainingRender" },
  @{ Path = "assets/js/modules/training-builder.js"; Export = "system.trainingBuilder" },
  @{ Path = "assets/js/modules/exercise-atlas-data.js"; Export = "system.exerciseAtlasData" },
  @{ Path = "assets/js/modules/exercise-atlas.js"; Export = "system.exerciseAtlas" },
  @{ Path = "assets/js/modules/labs.js"; Export = "system.labs" },
  @{ Path = "assets/js/modules/lab-protocols.js"; Export = "system.labProtocols" },
  @{ Path = "assets/js/modules/progress-decision.js"; Export = "system.progressDecision" },
  @{ Path = "assets/js/modules/blueprint.js"; Export = "system.blueprint" },
  @{ Path = "assets/js/modules/supplements.js"; Export = "system.supplements" },
  @{ Path = "assets/js/modules/coach.js"; Export = "system.coach" }
)

foreach ($module in $expectedModules) {
  $modulePath = Join-Path $root $module.Path

  if ($html -notmatch [regex]::Escape($module.Path)) {
    Add-Failure "Module script not referenced in index.html: $($module.Path)"
    continue
  }

  if (-not (Test-Path $modulePath)) {
    Add-Failure "Module file missing: $($module.Path)"
    continue
  }

  $moduleText = Get-FileText $modulePath
  if ($moduleText -notmatch [regex]::Escape($module.Export)) {
    Add-Failure "Module export missing in $($module.Path): $($module.Export)"
  }
}

foreach ($pwaRef in @("manifest.webmanifest", "service-worker.js", "assets/images/logo-icon.svg")) {
  if (-not (Test-Path (Join-Path $root $pwaRef))) {
    Add-Failure "PWA file missing: $pwaRef"
  }
}

if ($html -notmatch 'rel="manifest"') {
  Add-Failure "PWA manifest link missing in index.html"
}

if ($failures.Count -gt 0) {
  Write-Host "VitalRise checks failed:" -ForegroundColor Red
  foreach ($failure in $failures) {
    Write-Host " - $failure" -ForegroundColor Red
  }
  exit 1
}

Write-Host "VitalRise checks passed." -ForegroundColor Green
Write-Host "Checked ids, local refs, labels, number constraints, debug markers, nutrition data, and module exports."
