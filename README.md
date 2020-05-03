# Changelog Checker

This action will check that if a PR contains changelog.  
The existence of changelog file(s) is searched using regExp.  
which allows you to select a file as well a folder of files for changelog

## Usage:

```yaml
name: you should give a changelog
on: [pull_request]

jobs:
  build:
    name: Actions
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1.0.0
      - name: Check Changelog
        uses: masterashu/check_changelog@v0.0.1
        with: 
          # regExp pattern to match changelog file
          changelog: 'changelog.md'
          # Skip check when pull request is labelled using this blank will check all
          skip_changelog_label: ''
          # Default comment message when changelog is missing
          missing_changelog_message: > 
            It seems you forgot to add a changelog to your PR. If your PR doesn't require a changelog add the label `skip-changelog`.

```