export class Configuration {
  githubToken: string
  changelogPattern: string
  missingChangelogMessage: string
  noChangelogLabel: string
  skipChangelogLabel: string
  matchPrNumber: boolean

  constructor(
    githubToken: string,
    changelogPattern: string,
    noChangelogLabel: string,
    missingChangelogMessage: string,
    skipChangelogLabel: string,
    matchPrNumber: boolean
  ) {
    this.githubToken = githubToken
    this.changelogPattern = changelogPattern
    this.noChangelogLabel = noChangelogLabel
    this.missingChangelogMessage = missingChangelogMessage
    this.skipChangelogLabel = skipChangelogLabel
    this.matchPrNumber = matchPrNumber
  }
}
