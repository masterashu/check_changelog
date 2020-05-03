import * as github from '@actions/github'
import {Configuration} from './config'
import {PrService} from './pr'
import {Status, Checks} from './checks'
import * as core from '@actions/core'

export class ChangelogChecker {
  private _octokit: github.GitHub
  private _config: Configuration
  private _prService: PrService
  private _checks: Checks

  constructor(config: Configuration) {
    this._config = config
    this._octokit = new github.GitHub(this._config.githubToken)
    this._prService = new PrService(this._octokit, config, github.context)
    this._checks = new Checks(this._octokit, config)
  }

  async check(): Promise<Status> {
    // Search existing labels check if we can skip checking changelog.
    let status: Status
    const labels: string[] = await this._prService.getLabelsForCurrentPr()
    core.debug(labels.join('\n'))
    const pr = this._prService.getPr()
    core.debug(pr?.body ?? 'n/a')
    core.debug(pr?.number.toString() ?? 'n/a')
    if (
      (this._config.skipChangelogLabel?.length ?? 0) !== 0 &&
      labels.includes(this._config.skipChangelogLabel)
    ) {
      status = Status.MANUAL_SKIP
    } else {
      const result = await this._prService.searchFile(
        pr.pull_request?.number ?? 0
      )
      status = !result ? Status.MISSING_CHANGELOG : Status.OK
    }

    this._checks.createStatus(pr, status)
    return status
  }
}
