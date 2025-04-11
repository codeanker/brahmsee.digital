## Optional-Dependencie in docs

Bei einem frischen dev-container kommt bei Momme (mac arm64) ein Fehler, dass eine optional-dependencie fehlt. Auf Basis von [diesem Issue](https://github.com/npm/cli/issues/4828#issuecomment-1848965606) habe ich das package `@rollup/rollup-linux-arm64-gnu` als `optionalDependencies` im workspace `docs` hinzugefügt.
