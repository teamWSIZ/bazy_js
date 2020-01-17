


## serwisy.js

Testowa apka z serwisami nodejs, oraz 
narzedziami do kryptografii PKI/RSA


## moduly
https://www.npmjs.com/package/node-rsa
https://github.com/rzcoder/node-rsa

inne przyklady kodu:
https://github.com/aditosoftware/nodepki

## openssl

#### tworzenie pary kluczy

##### zabezpieczone haslem
prywatny: 

`openssl genrsa -passout pass:1234 -des3 -out alpha.key 2048`

publiczny (z prywatnego)

`openssl pkey -in alpha.key -pubout -outform pem > alpha.pub
`

##### otwarte (bez hasla)

`openssl genrsa -out beta.key 512`


`openssl pkey -in beta.key -pubout -outform pem > beta.pub`


#### szyfrowanie/deszyfrowanie

`openssl rsautl -encrypt -inkey alpha.pub -pubin -in supertajne.txt -out supertajne.xxx`

`openssl rsautl -decrypt -inkey alpha.key -in supertajne.xxx -out odkodowana.txt`

#### podpisywanie/sprawdzanie podpisu

`openssl dgst -sha1 -sign alpha.key -out annoucement.sha1 annoucement.txt
`

`openssl dgst -sha1 -verify alpha.pub -signature annoucement.sha1 annoucement.txt
`