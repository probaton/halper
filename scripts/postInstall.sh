#!/bin/sh
halpers=$(find node_modules -regex '.*@halper\/.*')
for halperPath in $halpers
do
  halperName=${halperPath#*'@halper/'}
  linkPath="$(pwd)/src/actions/modules/$halperName"
  mkdir -p $linkPath
  ln -sf $(pwd)/$halperPath/halpers/* $linkPath
done