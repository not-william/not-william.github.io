---
title: "Three personal repositories I maintain"
date: 2022-07-07
draft: false
slug: "personal-repos"
---

1. My dotfiles, such as my [neovim config](https://github.com/not-william/dotfiles/tree/master/.config/nvim) and my [IPython startup scripts](https://github.com/not-william/dotfiles/blob/master/ipython-startup.py).

   IPython startup scripts are run when opening a new IPython kernel. Being a data scientist and a heavy Jupyter notebooks user, having Numpy, Pandas, and other common libraries auto-imported saves me having to type the same lines at the top of every notebook. Furthermore, Pandas and matplotlib can be configued to use default styles when displaying a dataframe or a figure. I also configue automatic code formatting using [jupyter-black](https://pypi.org/project/jupyter-black/).
   
   ![image alt text](/blog/personal-repos/ipython-2.gif)
   
   <p style="text-align:center;margin-top:-10px;"><i>Auto-imports, figure styling, and code formatting.</i></p>
   
   To allow the dotfiles to be managed under version control in a central location, they are referenced via 		symlinks, e.g.:

```bash
# note - absolute paths must be used
ln -s /path/to/dotfiles_repo/.zshrc /Users/notwilliam/.zshrc
```

2. A [CLI cheatsheet](https://github.com/not-william/cheatsheet) of frequently used, but forgettable, commands. For example, resursively getting rid of `.DS_STORE` files on Mac, or converting a video file to an mp3.
2. [Useful scripts and code snippets](https://github.com/not-william/useful/). Sometimes it's useful to carry around custom scripts or code snippets. For example, I keep a script for cropping images to content in python, either for direct use or to include in larger data processing workflows. While there are tools that do this already, it can be done easily with Numpy without having to pull in extra dependencies.
