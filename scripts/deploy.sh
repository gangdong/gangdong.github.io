#!/bin/sh


# setup ssh-agent and provide the GitHub deploy key
openssl aes-256-cbc -K $encrypted_70fbe34e406c_key -iv $encrypted_70fbe34e406c_iv -in blog_id_rsa.enc -out blog_id_rsa -d
# 对解密后的私钥添加权限
chmod 600 blog_id_rsa

# 启动 ssh-agent
eval "$(ssh-agent -s)"

ssh-add blog_id_rsa

# 删除解密后的私钥
rm blog_id_rsa
ssh -T git@github.com
git show-ref
git remote set-url origin https://github.com/gangdong/daviddong.github.io.git
git show-ref
git remote -v
git clone https://github.com/gangdong/daviddong.github.io.git
git show-ref
git remote -v
# commit the assets in storybook-static/ to the gh-pages branch and push to GitHub using SSH
git config user.name "gangdong"
git config user.email "dqdongg@hotmail.com"
git remote add origin https://github.com/gangdong/daviddong.github.io.git
git show-ref
git remote -v
git checkout test_travisci
git add -f ./_site/*
git commit -m "Update docs"
git push -u origin test_travisci

