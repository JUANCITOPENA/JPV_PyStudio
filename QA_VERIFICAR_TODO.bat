@echo off
echo =======================================================================
echo JPV PyStudio Pro - Suite Integral de QA, Pruebas Unitarias y E2E
echo =======================================================================
python test_qa_suite_pystudio.py
if errorlevel 1 (
    echo.
    echo [ERROR] La suite de QA detecto fallos. El despliegue ha sido bloqueado.
    exit /b 1
) else (
    echo.
    echo [EXITO] 100 por ciento de las pruebas superadas. Sistema listo para produccion.
    exit /b 0
)
