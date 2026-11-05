$toolsDir = "C:\Users\Pruthvuraj S\.gemini\tools\git"
New-Item -ItemType Directory -Force -Path $toolsDir | Out-Null
$zipPath = "C:\Users\Pruthvuraj S\.gemini\tools\mingit.zip"

Write-Host "Downloading MinGit..."
$url = "https://github.com/git-for-windows/git/releases/download/v2.56.0.windows.4/MinGit-2.56.0.4-64-bit.zip"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
(New-Object Net.WebClient).DownloadFile($url, $zipPath)

Write-Host "Extracting MinGit..."
Expand-Archive -Path $zipPath -DestinationPath $toolsDir -Force
Remove-Item $zipPath -Force

Write-Host "Verifying git.exe..."
& "$toolsDir\cmd\git.exe" --version

# Add to user environment path
$currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($currentPath -notlike "*$toolsDir\cmd*") {
  [Environment]::SetEnvironmentVariable("Path", "$currentPath;$toolsDir\cmd", "User")
  Write-Host "Added to User PATH."
}
