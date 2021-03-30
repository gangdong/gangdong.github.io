#!/bin/sh
set -e

# setup ssh-agent and provide the GitHub deploy key
openssl openssl aes-256-cbc -K $encrypted_f217180e22ee_key -iv $encrypted_f217180e22ee_iv -in id_rsa.enc -out id_rsa -d
# 对解密后的私钥添加权限
chmod 600 id_rsa

# 启动 ssh-agent
eval "$(ssh-agent -s)"

ssh-add id_rsa

# 删除解密后的私钥
rm id_rsa

git config --global user.name 'Travis'  
git config --global user.email 'travis@travis-ci.com' 

# commit the assets in storybook-static/ to the gh-pages branch and push to GitHub using SSH
cp ./_site/* ../site
git checkout test_travisci
rm -rf *
cp ../site/* ./
git add --all .
git commit -m "Travis CI Auto Builder"
git push -u origin master
