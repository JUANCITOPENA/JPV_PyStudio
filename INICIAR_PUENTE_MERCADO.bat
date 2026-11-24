@echo off
title JPV PyStudio - Puente de Mercado Financiero en Vivo (CORS Proxy)
color 0B
cls
echo =====================================================================
echo   JPV PYSTUDIO // PUENTE FINANCIERO EN VIVO (YAHOO FINANCE & WALL ST)
echo   Autor: Ing. Juancito Pena Vizcaino
echo =====================================================================
echo.
echo [*] Iniciando servidor proxy local seguro con CORS en http://127.0.0.1:8088 ...
echo [*] Este puente permite que JPV PyStudio en tu navegador consulte
echo     Yahoo Finance en tiempo real para NVDA, AAPL, Tesla, Cripto, etc.
echo.
echo Presiona Ctrl+C en cualquier momento para detener el puente.
echo.
python bridge_mercado.py
pause
