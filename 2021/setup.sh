#!/bin/sh
deno completions bash > deno.bash
source deno.bash
rm deno.bash

mkdir -p deno_dir
export DENO_DIR=./deno_dir
for f in ./src/_deps/*; do deno cache $f; done
