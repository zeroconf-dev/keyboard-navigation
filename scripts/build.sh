#!/bin/bash -e

DIR="$(realpath "$(dirname "${BASH_SOURCE[0]}")/..")"

clean() {
    (
        cd "$DIR" && \
        rm -Rf package/build package/dist && \
        find package -type f \( -regex '.*\.\(bak\|tsx?\|md\|map\|m?js\)' -o -name LICENSE \) -delete && \
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

build() {
    (
        cd "$DIR" && \
        ./node_modules/.bin/rollup -c rollup.config.dist.js &&
        moveBuild
    )
}

copySource() {
    local d
    (
        cd "$DIR" && \
        for f in $(find src -type f \( -name '*.ts' -o -name '*.tsx' \) | grep -v '__tests__' | grep -v '/stories/' | grep -v 'vite-env.d.ts' ); do
            d="$(dirname "${f/src/package}")"
            [ ! -d "$d" ] && mkdir -p "$d"
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
build
copySource
copyStatic
