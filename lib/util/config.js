"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Configuration {
    constructor(githubToken, changelogPattern, noChangelogLabel, missingChangelogMessage, skipChangelogLabel) {
        this.githubToken = githubToken;
        this.changelogPattern = changelogPattern;
        this.noChangelogLabel = noChangelogLabel;
        this.skipChangelogLabel = skipChangelogLabel;
        this.missingChangelogMessage = missingChangelogMessage;
    }
}
exports.Configuration = Configuration;