import * as core from '@actions/core'

export function readGithubToken(): string {
  const token = process.env['GITHUB_TOKEN']
  core.debug(`token: ${token}`)
  if (!token)
    throw ReferenceError(
      'Github token required, add "env: GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}"'
    )
  return token
}
