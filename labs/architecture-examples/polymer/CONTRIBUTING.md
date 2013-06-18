# Contributing

Want to contribute to Polymer? Great!

We are more than happy to accept external contributions to the project in the form of [feedback](https://groups.google.com/forum/?fromgroups=#!forum/polymer-dev), [bug reports](../../issues), and pull requests.

## Contributor License Agreement

Before we can accept patches, there's a quick web form you need to fill out.

- If you're contributing as and individual (e.g. you own the intellectual property), fill out [this form](http://code.google.com/legal/individual-cla-v1.0.html).
- If you're contributing under a company, fill out [this form](http://code.google.com/legal/corporate-cla-v1.0.html) instead.

This CLA asserts that contributions are owned by you and that we can license all work under our [license](LICENSE).

Other projects require a similar agreement: jQuery, Firefox, Apache, Node, and many more.

[More about CLAs](https://www.google.com/search?q=Contributor%20License%20Agreement)

## Initial setup

Here's an easy guide that should get you up and running:

1. Fork the project on github and pull down your copy.
   > replace the {{ username }} with your username and {{ repository }} with the repository name

        git clone git@github.com:{{ username }}/{{ repository }}.git --recursive

    Note the `--recursive`. This is necessary for submodules to initialize properly. If you don't do a recursive clone, you'll have to init them manually:

        git submodule init
        git submodule update

2. Development happens on the `master` branch. Get yourself on it!

        git checkout master

That's it for the one time setup. Now you're ready to make a change.

## Submitting a pull request

We iterate fast! To avoid potential merge conflicts, it's a good idea to pull from the main project before making a change and submitting a pull request. The easiest way to do this is setup a remote called `upstream` and do a pull before working on a change:

    git remote add upstream git://github.com/Polymer/{{ repository }}.git

Then before making a change, do a pull from the upstream `master` branch:

    git pull upstream master

To make life easier, add a "pull upstream" alias in your `.gitconfig`:

    [alias]
      pu = !"git fetch origin -v; git fetch upstream -v; git merge upstream/master"

That will pull in changes from your forked repo, the main (upstream) repo, and merge the two. Then it's just a matter of running `git pu` before a change and pushing to your repo:

    git checkout master
    git pu
    # make change
    git commit -a -m 'Awesome things.'
    git push

Lastly, don't forget to submit the pull request.
