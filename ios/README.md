# jobhax

To pull only ios/ folder from JobHax repo:
```
git init
git remote add -f origin git@github.com:goupaz/jobhax.git
git config core.sparsecheckout true
echo ios/ >> .git/info/sparse-checkout
git pull origin master
```
