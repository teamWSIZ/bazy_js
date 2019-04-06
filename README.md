## Prosta apka w  node.js używająca typescript i łącząca się do bazy danych postgres

* aplikacja wymaga nodejs (do zainstalowania z https://nodejs.org/en/download/)
* zklonować repo (gitbash / bash; konsola)
* w głównym folderze uruchomić (z konsoli) `npm install`
* potem (lub między edycjami) uruchomić `tsc` (kompilacja .ts do .js)
* cały projekt zbudowany jest w folderze `build`; celem uruchomienia trzeba tam wejść i dać `node app.js`
* uwaga: na wspólnych hostach zmodyfikować port i schemat postgresa (w okolicach kodu `app.listen`)


### troubleshooting
* gdyby pisało `tsc not recognized...` to wykonać `npm install -g typescript`