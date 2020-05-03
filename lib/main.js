"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const checker = __importStar(require("./util/checker"));
const token_1 = require("./util/token");
const config_1 = require("./util/config");
const checks_1 = require("./util/checks");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            core.debug('Changelog Checker');
            const changelogPattern = core.getInput('changelog', {
                required: true
            });
            const missingChangelogMessage = core.getInput('missing_changelog_message');
            const noChangelogLabel = core.getInput('no_changelog_label');
            const skipChangelogLabel = core.getInput('skip_changelog_label');
            const githubToken = token_1.readGithubToken();
            const config = new config_1.Configuration(changelogPattern, noChangelogLabel, skipChangelogLabel, missingChangelogMessage, githubToken);
            core.debug(`verifying existence of ${changelogPattern}`);
            const changelogChecker = new checker.ChangelogChecker(config);
            const status = yield changelogChecker.check();
            core.setOutput('has_changelog', status === checks_1.Status.OK || status === checks_1.Status.MANUAL_SKIP);
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
