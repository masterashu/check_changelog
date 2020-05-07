// The Checks to prevent merging.
import {Configuration} from './config'
import {Octokit} from '@octokit/rest'
import * as github from '@actions/github'
import {WebhookPayload} from '@actions/github/lib/interfaces'
import * as core from '@actions/core'
import {Context} from '@actions/github/lib/context'

export class Checks {
  constructor(
    private _octokit: github.GitHub,
    private _config: Configuration,
    private _githubContext: Context
  ) {}

  async createStatus(
    pullRequest: WebhookPayload,
    status: Status
  ): Promise<void> {
    const headSha = await this.getHeadSha()
    const output = this.getOutput(status)
    const conclusion = this.getConclusion(status)

    const params: Octokit.ChecksCreateParams = {
      ...github.context.repo,
      conclusion,
      head_sha: headSha, // eslint-disable-line @typescript-eslint/camelcase
      name: 'Changelog check',
      output
    }

    const check = await this._octokit.checks.create(params)
    core.info(JSON.stringify(check))
  }

  async getHeadSha(): Promise<string> {
    const pr: Octokit.Response<Octokit.PullsGetResponse> = await this._octokit.pulls.get(
      {
        ...this._githubContext.repo,
        // eslint-disable-next-line @typescript-eslint/camelcase
        pull_number: this._githubContext.payload.pull_request?.number ?? 0
      }
    )
    return pr.data.head.sha
  }

  private getOutput(
    status: Status
  ): Octokit.ChecksCreateParamsOutput | undefined {
    if (Status.OK === status) {
      return {
        title: 'Everything looks good',
        summary: 'You have added the changelog files as requested'
      }
    } else if (Status.MISSING_CHANGELOG === status) {
      return {
        title: this._config.missingChangelogMessage,
        summary: `There is no file found matching the regex pattern "${this._config.changelogPattern}" in the PR.`
      }
    } else if (Status.MANUAL_SKIP === status) {
      return {
        title: `Ignore chagelog by label ${this._config.noChangelogLabel}`,
        summary: `The Changelog check is skipped since ${this._config.noChangelogLabel} label is added.`
      }
    }
  }

  private getConclusion(status: Status): Conclusion {
    if (Status.OK === status) {
      return Conclusion.SUCCESS
    } else if (Status.MANUAL_SKIP === status) {
      return Conclusion.NEUTRAL
    }
    return Conclusion.FAILURE
  }
}

export enum Conclusion {
  SUCCESS = 'success',
  FAILURE = 'failure',
  NEUTRAL = 'neutral',
  CANCELLED = 'cancelled',
  TIMED_OUT = 'timed_out',
  ACTION_REQUIRED = 'action_required'
}

export enum Status {
  OK,
  MISSING_CHANGELOG,
  MANUAL_SKIP
}
