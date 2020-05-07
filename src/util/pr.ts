import * as github from '@actions/github'
import {Context} from '@actions/github/lib/context'
import {Octokit} from '@octokit/rest'
import {WebhookPayload} from '@actions/github/lib/interfaces'
import {Configuration} from './config'

export class PrService {
  private _octokit: github.GitHub
  private _config: Configuration
  private _githubContext: Context

  constructor(
    _octokit: github.GitHub,
    _config: Configuration,
    _githubContext: Context
  ) {
    this._octokit = _octokit
    this._config = _config
    this._githubContext = _githubContext
  }

  async searchFile(
    pr: number
  ): Promise<Octokit.PullsListFilesResponseItem | undefined> {
    const regex = new RegExp(this._config.changelogPattern)
    const files = await this._octokit.pulls.listFiles({
      ...this._githubContext.repo,
      // eslint-disable-next-line @typescript-eslint/camelcase
      pull_number: pr
    })
    return files.data.find((value: {filename: string}) =>
      regex.test(value.filename)
    )
  }

  async getLabelsForCurrentPr(): Promise<string[]> {
    const pr = this.getPr()
    const labels: Octokit.Response<Octokit.IssuesListLabelsOnIssueResponse> = await this._octokit.issues.listLabelsOnIssue(
      {
        ...this._githubContext.repo,
        // eslint-disable-next-line @typescript-eslint/camelcase
        issue_number: pr.pull_request?.number ?? 0
      }
    )
    return Promise.all(labels.data.map(async it => it.name))
  }

  async addCommentToPr(): Promise<void> {
    if (this._config.missingChangelogMessage.length !== 0) {
      await this._octokit.issues.createComment({
        ...github.context.repo,
        // eslint-disable-next-line @typescript-eslint/camelcase
        issue_number: this.getPr().pull_request?.number ?? 0,
        body: this._config.missingChangelogMessage
      })
    }
  }

  async addLabelToCurrentPr(): Promise<void> {
    if (this._config.noChangelogLabel.length !== 0) {
      await this._octokit.issues.addLabels({
        ...github.context.repo,
        // eslint-disable-next-line @typescript-eslint/camelcase
        issue_number: this.getPr().pull_request?.number ?? 0,
        labels: [this._config.noChangelogLabel]
      })
    }
  }

  async removeLabelFromCurrentPr(): Promise<void> {
    if (this._config.noChangelogLabel.length !== 0) {
      await this._octokit.issues.removeLabel({
        ...github.context.repo,
        // eslint-disable-next-line @typescript-eslint/camelcase
        issue_number: this.getPr().pull_request?.number ?? 0,
        name: this._config.noChangelogLabel
      })
    }
  }

  getPr(): WebhookPayload {
    const pr = this._githubContext.payload
    if (pr.pull_request) {
      return pr
    } else {
      throw new Error('Not a PR')
    }
  }
}
