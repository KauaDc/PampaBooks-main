@echo off
cd layouts
start cmd /k "npm install"
start cmd /k "npm start"
cd ..\ms-autenticacao
start cmd /k "npm install"
start cmd /k "npm start"
cd ..\ms-avaliacao
start cmd /k "npm install"
start cmd /k "npm start"
cd ..\ms-catalogo
start cmd /k "npm install"
start cmd /k "npm start"
cd ..\ms-pedidos
start cmd /k "npm install"
start cmd /k "npm start"
start msedge "http://localhost:3001/"
echo Tudo iniciado em janelas separadas
pause
