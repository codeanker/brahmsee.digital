
# brahmsee.digital

![ci workflow](https://github.com/codeanker/brahmsee.digital/actions/workflows/ci.yml/badge.svg)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
![GitHub package.json version (branch)](https://img.shields.io/github/package-json/v/codeanker/brahmsee.digital/development)


Dieses Projekt dient der Verwaltung der Großveranstaltung "Landeskindertreffen im Waldheim am Brahmsee", der DLRG-Jugend Schleswig-Holstein. Es ist ein Open Source Project und darf gerne weiterentwickelt werden.

## Install und Shortcodes

Am besten wird das Projekt in einem Devcontainer gestartet. Dazu wird nur Docker, VsCode und die devcontainer Erweierung benötigt.
Über den Eintrag "Clone Repository in Container Volume" kann das Projekt heruntergeladen und geöffnet werden.
Das Projekt wird dann automatisch eingerichtet und kann wenn das Abgeschlossen ist auch gestartet werden.

## Starten

Find all Tasks in CMD/CTRL-SHIFT-P -> `Tasks: Run Tasks`

1. Clone via VSCode CMD/CTRL-SHIFT-P -> `Dev Containers: Clone Repository in Container Volume`
2. Run Task: `run:migration`
2. Run Task: `run:createAccount`
2. Run Task: `install:playwright`
4. Run Task: `start:apps`

## Mitarbeit
Bei Fragen kannst Du dich einfach an @danielswiatek wenden. Dieses Project nutzt Issues um sich zu organisieren. Wenn Du entwickelts erstelle einfach einen Branch der dann mittels PR zurück geführt werden kann.
