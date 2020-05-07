import {Configuration} from './config'
import {PrService} from './pr'
import {Status, Checks} from './checks'
import * as core from '@actions/core'
import * as github from '@actions/github'

export class ChangelogChecker {
  private _octokit: github.GitHub
  private _config: Configuration
  private _prService: PrService
  private _checks: Checks

  constructor(config: Configuration) {
    this._config = config
    this._octokit = new github.GitHub(config.githubToken)
    const githubContext = github.context
    this._checks = new Checks(this._octokit, this._config, githubContext)
    this._prService = new PrService(this._octokit, this._config, githubContext)
  }

  async check(): Promise<Status> {
    // Search existing labels check if we can skip checking changelog.
    const pr = this._prService.getPr()
    let status: Status
    core.debug(`Check for skipLabel: ${this._config.skipChangelogLabel}`)
    const labels: string[] = await this._prService.getLabelsForCurrentPr()
    core.debug(`All Labels: ${labels.join(', ')}`)
    if (
      (this._config.skipChangelogLabel?.length ?? 0) !== 0 &&
      labels.includes(this._config.skipChangelogLabel)
    ) {
      core.debug(`Skipped check due to ${this._config.skipChangelogLabel}.`)
      status = Status.MANUAL_SKIP
    } else {
      core.debug('checking for any files matching the changelog pattern.')
      const result = await this._prService.searchFile(
        pr.pull_request?.number ?? 0
      )
      status = !result ? Status.MISSING_CHANGELOG : Status.OK
      if (!result) {
        await this._prService.addCommentToPr()
        await this._prService.addLabelToCurrentPr()
      } else {
        await this._prService.removeLabelFromCurrentPr()
      }
    }

    this._checks.createStatus(pr, status)
    return status
  }
}
