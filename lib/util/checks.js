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
const github = __importStar(require("@actions/github"));
const core = __importStar(require("@actions/core"));
class Checks {
    constructor(_octokit, _config) {
        this._octokit = _octokit;
        this._config = _config;
    }
    createStatus(pullRequest, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const headSha = pullRequest.head.sha;
            const output = this.getOutput(status);
            const conclusion = this.getConclusion(status);
            const params = Object.assign(Object.assign({}, github.context.repo), { conclusion, head_sha: headSha, name: 'Changelog check', output });
            const check = yield this._octokit.checks.create(params);
            core.info(JSON.stringify(check));
        });
    }
    getOutput(status) {
        if (Status.MISSING_CHANGELOG === status) {
            return {
                title: this._config.missingChangelogMessage,
                summary: `There is no file found matching the regex pattern "${this._config.changelogPattern}" in the PR.`
            };
        }
        else if (Status.MANUAL_SKIP) {
            return {
                title: `Ignore chagelog by label ${this._config.noChangelogLabel}`,
                summary: `The Changelog check is since ${this._config.noChangelogLabel} label is added.`
            };
        }
    }
    getConclusion(status) {
        if (Status.OK === status) {
            return Conclusion.SUCCESS;
        }
        else if (Status.MANUAL_SKIP === status) {
            return Conclusion.NEUTRAL;
        }
        return Conclusion.FAILURE;
    }
}
exports.Checks = Checks;
var Conclusion;
(function (Conclusion) {
    Conclusion["SUCCESS"] = "success";
    Conclusion["FAILURE"] = "failure";
    Conclusion["NEUTRAL"] = "neutral";
    Conclusion["CANCELLED"] = "cancelled";
    Conclusion["TIMED_OUT"] = "timed_out";
    Conclusion["ACTION_REQUIRED"] = "action_required";
})(Conclusion = exports.Conclusion || (exports.Conclusion = {}));
var Status;
(function (Status) {
    Status[Status["OK"] = 0] = "OK";
    Status[Status["MISSING_CHANGELOG"] = 1] = "MISSING_CHANGELOG";
    Status[Status["MANUAL_SKIP"] = 2] = "MANUAL_SKIP";
})(Status = exports.Status || (exports.Status = {}));
