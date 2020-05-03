"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function readGithubToken() {
    const token = process.env.GITHUB_TOKEN;
    if (!token)
        throw ReferenceError('Github token required, add "env: GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}"');
    return token;
}
exports.readGithubToken = readGithubToken;
