# brahmsee.digital

Dieses Projekt dient der Verwaltung der Großveranstaltung "Landeskindertreffen im Waldheim am Brahmsee", der DLRG-Jugend Schleswig-Holstein. Es ist ein Open Source Project und darf gerne weiterentwickelt werden.

## Setup
Das Projekt ist aufgeteilt in Client und API die mittels Docker-Containern laufen. Am besten kann man es mit VSCODE entwickeln, hierfür liefern wir auch gleich eine Konfiguration. Hierzu wird Docker und NODEJS benötigt. Zum starten einfach in der Console ```npm start``` im Root-Verzeichnis ausführen. Das Projekt kommt mit einem Linter und FixOnSave. Dazu muss in den Verzeichnis API und Frontend jeweils ```npm i``` ausgeführt werden.

## Install und Shortcodes

1. git checkout {{branch}}
2. .env.local duplizieren und umbenennen in .env
3. npm ci
4. npm start
5. cd api/
6. npx prisma generate
7. npx prisma db push
8. npm run createUser

## Mitarbeit
Bei Fragen kannst Du dich einfach an @danielswiatek wenden. Dieses Project nutzt Issues um sich zu organisieren. Wenn Du entwickelts erstelle einfach einen Branch der dann mittels PR zurück geführt werden kann.
