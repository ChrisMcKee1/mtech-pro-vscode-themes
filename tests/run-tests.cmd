@echo off
setlocal enabledelayedexpansion

:: M Tech Themes - Enhanced Test Runner
:: Supports multiple test modes for efficient theme refactoring workflow

set "TEST_MODE=%~1"

if "%TEST_MODE%"=="" (
    set "TEST_MODE=--quick"
)

echo.
echo ========================================================
echo   M TECH THEMES - TEST SUITE
echo ========================================================
echo.

if "%TEST_MODE%"=="--help" (
    echo Usage: run-tests.cmd [mode]
    echo.
    echo Modes:
    echo   --quick      Structure validation only [DEFAULT]
    echo   --contrast   Run contrast analysis for accessibility
    echo   --status     Show refactor status dashboard
    echo   --full       Run all tests [structure + contrast + status]
    echo   --help       Show this help message
    echo.
    exit /b 0
)

if "%TEST_MODE%"=="--quick" (
    echo Mode: QUICK [Structure Validation]
    echo ----------------------------------------
    echo.
    echo [1/2] Command Functionality Tests...
    node test-command-functionality.js
    if !ERRORLEVEL! neq 0 (
        echo ERROR: Command tests failed
        exit /b 1
    )
    echo.
    echo [2/2] Mapping Validation Tests...
    node test-mapping-validation.js
    if !ERRORLEVEL! neq 0 (
        echo ERROR: Mapping tests failed
        exit /b 1
    )
    echo.
    echo ========================================================
    echo   QUICK TESTS COMPLETE
    echo ========================================================
    echo.
    exit /b 0
)

if "%TEST_MODE%"=="--contrast" (
    echo Mode: CONTRAST ANALYSIS [Accessibility]
    echo ----------------------------------------
    echo.
    node test-contrast-analysis.js
    if !ERRORLEVEL! neq 0 (
        echo ERROR: Contrast analysis failed
        exit /b 1
    )
    echo.
    echo ========================================================
    echo   CONTRAST ANALYSIS COMPLETE
    echo ========================================================
    echo.
    exit /b 0
)

if "%TEST_MODE%"=="--status" (
    echo Mode: REFACTOR STATUS [Dashboard]
    echo ----------------------------------------
    echo.
    node test-refactor-status.js
    if !ERRORLEVEL! neq 0 (
        echo ERROR: Status tracker failed
        exit /b 1
    )
    echo.
    echo ========================================================
    echo   STATUS REPORT COMPLETE
    echo ========================================================
    echo.
    exit /b 0
)

if "%TEST_MODE%"=="--full" (
    echo Mode: FULL SUITE [All Tests]
    echo ----------------------------------------
    echo.
    echo [1/4] Command Functionality Tests...
    node test-command-functionality.js
    if !ERRORLEVEL! neq 0 (
        echo ERROR: Command tests failed
        exit /b 1
    )
    echo.
    echo [2/4] Mapping Validation Tests...
    node test-mapping-validation.js
    if !ERRORLEVEL! neq 0 (
        echo ERROR: Mapping tests failed
        exit /b 1
    )
    echo.
    echo [3/4] Contrast Analysis...
    node test-contrast-analysis.js
    if !ERRORLEVEL! neq 0 (
        echo ERROR: Contrast analysis failed
        exit /b 1
    )
    echo.
    echo [4/4] Refactor Status...
    node test-refactor-status.js
    if !ERRORLEVEL! neq 0 (
        echo ERROR: Status tracker failed
        exit /b 1
    )
    echo.
    echo ========================================================
    echo   FULL TEST SUITE COMPLETE
    echo ========================================================
    echo.
    exit /b 0
)

echo ERROR: Unknown test mode "%TEST_MODE%"
echo Run "run-tests.cmd --help" for usage information
exit /b 1 