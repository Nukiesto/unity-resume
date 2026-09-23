# Локальный запуск сайта-портфолио.
# Вызывается из serve.bat либо напрямую:
#   powershell -NoProfile -ExecutionPolicy Bypass -File tools\serve.ps1 [порт]

param(
    [int]$Port = 8080
)

$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $Root

# Корректный вывод кириллицы в консоль и в перенаправленный поток.
try {
    [Console]::OutputEncoding = New-Object System.Text.UTF8Encoding($false)
    $OutputEncoding = New-Object System.Text.UTF8Encoding($false)
} catch { }

function Write-Info($text) { Write-Host $text -ForegroundColor Cyan }
function Write-Ok($text)   { Write-Host $text -ForegroundColor Green }
function Write-Warn($text) { Write-Host $text -ForegroundColor Yellow }
function Write-Err($text)  { Write-Host $text -ForegroundColor Red }

Write-Host ''

if (-not (Test-Path -LiteralPath (Join-Path $Root 'index.html'))) {
    Write-Err "Не найден index.html в $Root"
    Write-Host ''
    Read-Host 'Нажмите Enter для выхода'
    exit 1
}

# --- свободный порт -------------------------------------------------------
function Test-PortFree([int]$p) {
    try {
        $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $p)
        $listener.Start()
        $listener.Stop()
        return $true
    } catch {
        return $false
    }
}

$startPort = $Port
while (-not (Test-PortFree $Port)) {
    Write-Warn "Порт $Port занят, пробую следующий..."
    $Port++
    if ($Port -gt $startPort + 40) {
        Write-Err 'Не удалось найти свободный порт.'
        Write-Host ''
        Read-Host 'Нажмите Enter для выхода'
        exit 1
    }
}

$url = "http://127.0.0.1:$Port/"

# --- выбор сервера --------------------------------------------------------
function Test-Command($exe, $argsList) {
    try {
        $null = & $exe @argsList 2>$null
        return ($LASTEXITCODE -eq 0)
    } catch {
        return $false
    }
}

# --- скриншоты: обновить манифест, если есть Node.js ----------------------
$screenshotsScript = Join-Path $PSScriptRoot 'screenshots.js'
if ((Test-Command 'node' @('--version')) -and (Test-Path -LiteralPath $screenshotsScript)) {
    try {
        $out = & node $screenshotsScript 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host ('  Скриншоты: ' + ($out | Select-Object -First 1)) -ForegroundColor DarkGray
        }
    } catch { }
}

$serverExe = $null
$serverArgs = @()

if (Test-Command 'py' @('-3', '-c', 'print(1)')) {
    $serverExe = 'py'
    $serverArgs = @('-3', '-m', 'http.server', "$Port", '--bind', '127.0.0.1')
} elseif (Test-Command 'python' @('-c', 'print(1)')) {
    $serverExe = 'python'
    $serverArgs = @('-m', 'http.server', "$Port", '--bind', '127.0.0.1')
} elseif (Test-Command 'node' @('-e', 'process.exit(0)')) {
    $serverExe = 'node'
    $serverArgs = @((Join-Path $PSScriptRoot 'dev-server.js'), "$Port")
} else {
    Write-Err 'Не найден ни Python, ни Node.js.'
    Write-Host 'Установите Python (python.org) или Node.js (nodejs.org) и запустите снова.'
    Write-Host ''
    Read-Host 'Нажмите Enter для выхода'
    exit 1
}

# --- открыть браузер после старта сервера ---------------------------------
$null = Start-Job -ScriptBlock {
    param($u)
    Start-Sleep -Milliseconds 1400
    try { Start-Process $u } catch { }
} -ArgumentList $url

# --- запуск ---------------------------------------------------------------
Write-Ok '  Портфолио запущено локально'
Write-Host ('  ' + ('-' * 42)) -ForegroundColor DarkGray
Write-Host '  Адрес:  ' -NoNewline; Write-Host $url -ForegroundColor Green
Write-Host '  Папка:  ' -NoNewline; Write-Host $Root -ForegroundColor DarkGray
Write-Host '  Сервер: ' -NoNewline; Write-Host "$serverExe $($serverArgs -join ' ')" -ForegroundColor DarkGray
Write-Host ''
Write-Host '  Браузер откроется автоматически.' -ForegroundColor DarkGray
Write-Host '  Остановить сервер: Ctrl+C или закройте это окно.' -ForegroundColor DarkGray
Write-Host ''

try {
    & $serverExe @serverArgs
} finally {
    Get-Job -ErrorAction SilentlyContinue | Remove-Job -Force -ErrorAction SilentlyContinue
    Write-Host ''
    Write-Warn '  Сервер остановлен.'
    Write-Host ''
}
