@echo off
setlocal
cd /d "%~dp0"
chcp 65001 >nul

echo.
echo === VITANOVA V5.5 - COMPILAR VISUAL PERSONALIZADO ===
echo.
where node >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js no esta instalado. Instala Node.js LTS desde https://nodejs.org/
  pause
  exit /b 1
)
where npm >nul 2>nul
if errorlevel 1 (
  echo ERROR: npm no esta disponible.
  pause
  exit /b 1
)

if not exist "node_modules\.bin\pbiviz.cmd" (
  echo Instalando dependencias del visual...
  call npm install --no-audit --no-fund
  if errorlevel 1 (
    echo ERROR: npm install ha fallado.
    pause
    exit /b 1
  )
) else (
  echo Dependencias ya instaladas. Omitiendo reinstalacion.
)

echo.
echo Comprobando TypeScript...
call npx --no-install tsc --noEmit
if errorlevel 1 (
  echo ERROR: TypeScript ha encontrado errores.
  pause
  exit /b 1
)

echo.
echo Verificando reglas de seguridad y lint...
call npx --no-install pbiviz lint --verbose
if errorlevel 1 (
  echo ERROR: El analisis de lint ha fallado.
  pause
  exit /b 1
)

echo.
echo Generando .pbiviz...
if exist "dist\*.pbiviz" del /q "dist\*.pbiviz" >nul 2>nul
call npx --no-install pbiviz package
if errorlevel 1 (
  echo ERROR: La herramienta de compilacion ha informado de un fallo.
  pause
  exit /b 1
)
if not exist "dist\*.pbiviz" (
  echo ERROR: No se ha generado ningun archivo .pbiviz.
  pause
  exit /b 1
)

echo.
echo ============================================
echo COMPILACION COMPLETADA: dist\*.pbiviz
 echo ============================================
start "" "%~dp0dist"
pause
