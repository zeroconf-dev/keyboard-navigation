#!/bin/bash -e

DIR="$(realpath "$(dirname "${BASH_SOURCE[0]}")/..")"

clean() {
    (\
        cd "$DIR" && \
        rm -Rf package/build package/dist && \
        find package -type f \( -regex '.*\.\(tsx?\|md\|map\|m?js\)' -o -name LICENSE \) -delete && \
        find package -mindepth 1 -type d -delete
    )
}

moveBuild() {
    (
        cd "$DIR" && \
        cp -R package/build/* package/ && \
        rm -Rf package/build
    )
}

buildLib() {
    (
        cd "$DIR" && \
        yarn tsc -p tsconfig.lib.json && \
        moveBuild
    )
}

buildLib2015() {
    (
        cd "$DIR" && \
        yarn tsc -p tsconfig.lib2015.json && \
        # perl -p -i -e 's|(^//# sourceMappingURL=.*).js.map$|$1.mjs.map|' package/build/*.js package/build/**/*.js && \
        # for f in $(find package/build -type f -name '*.js'); do
        #     mv "$f" "$(dirname "$f")/$(basename "$f" .js).mjs"
        # done && \
        # for f in $(find package/build -type f -name '*.js.map'); do
        #     mv "$f" "$(dirname "$f")/$(basename "$f" .js.map).mjs.map"
        # done && \
        moveBuild
    )
}

buildLibNext() {
    (
        cd "$DIR" && \
        yarn tsc -p tsconfig.libnext.json && \
        perl -p -i -e 's|(^//# sourceMappingURL=.*).js.map$|$1.esnext.mjs.map|' package/build/*.js package/build/**/*.js && \
        for f in $(find package/build -type f -name '*.js'); do
            mv "$f" "$(dirname "$f")/$(basename "$f" .js).esnext.mjs"
        done && \
        for f in $(find package/build -type f -name '*.js.map'); do
            mv "$f" "$(dirname "$f")/$(basename "$f" .js.map).esnext.mjs.map"
        done && \
        moveBuild
    )
}

buildUmd() {
    (
        cd "$DIR" && \
        ./node_modules/.bin/rollup -c rollup.config.dist.js
    )
}

copySource() {
    (
        cd "$DIR" && \
        for f in $(find src -type f \( -name '*.ts' -o -name '*.tsx' \) | grep -v __tests__); do
            cp "$f" "${f/src/package}"
        done
    )
}

copyStatic() {
    (
        cd "$DIR" && \
        cp LICENSE README.md package/
    )
}

clean
# buildLib
buildLib2015
# buildLibNext
# buildUmd
copySource
copyStatic
