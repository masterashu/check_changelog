export function readGithubToken(): string {
  const token = process.env['GITHUB_TOKEN']
  if (!token)
    throw ReferenceError(
      'Github token required, add "env: GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}"'
    )
  return token
}
