"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
function readGithubToken() {
    const token = process.env['GITHUB_TOKEN'];
    core.debug(`token: ${token}`);
    if (!token)
        throw ReferenceError('Github token required, add "env: GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}"');
    return token;
}
exports.readGithubToken = readGithubToken;
