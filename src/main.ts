import * as core from '@actions/core'
import * as checker from './util/checker'
import {readGithubToken} from './util/token'
import {Configuration} from './util/config'
import {Status} from './util/checks'

async function run(): Promise<void> {
  try {
    core.debug('Changelog Checker')
    const githubToken: string = readGithubToken()
    const changelogPattern: string = core.getInput('changelog', {
      required: true
    })
    const missingChangelogMessage = core.getInput('missing_changelog_message')
    const noChangelogLabel: string = core.getInput('no_changelog_label')
    const skipChangelogLabel: string = core.getInput('skip_changelog_label')

    const config: Configuration = new Configuration(
      githubToken,
      changelogPattern,
      noChangelogLabel,
      missingChangelogMessage,
      skipChangelogLabel
    )
    core.debug(`verifying existence of "${changelogPattern}"`)
    const changelogChecker: checker.ChangelogChecker = new checker.ChangelogChecker(
      config
    )

    const status = await changelogChecker.check()
    core.setOutput(
      'has_changelog',
      status === Status.OK || status === Status.MANUAL_SKIP
    )
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
