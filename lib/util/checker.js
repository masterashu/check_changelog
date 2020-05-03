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
const pr_1 = require("./pr");
const checks_1 = require("./checks");
class ChangelogChecker {
    constructor(config) {
        this._config = config;
        this._octokit = new github.GitHub(this._config.githubToken);
        this._prService = new pr_1.PrService(this._octokit, config, github.context);
        this._checks = new checks_1.Checks(this._octokit, config);
    }
    check() {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            // Search existing labels check if we can skip checking changelog.
            let status;
            const labels = yield this._prService.getLabelsForCurrentPr();
            const pr = this._prService.getPr();
            if ((_b = (_a = this._config.skipChangelogLabel) === null || _a === void 0 ? void 0 : _a.length, (_b !== null && _b !== void 0 ? _b : 0)) !== 0 &&
                labels.includes(this._config.skipChangelogLabel)) {
                status = checks_1.Status.MANUAL_SKIP;
            }
            else {
                const result = yield this._prService.searchFile((_d = (_c = pr.pull_request) === null || _c === void 0 ? void 0 : _c.number, (_d !== null && _d !== void 0 ? _d : 0)));
                status = !result ? checks_1.Status.MISSING_CHANGELOG : checks_1.Status.OK;
            }
            this._checks.createStatus(this._prService.getPr(), status);
            return status;
        });
    }
}
exports.ChangelogChecker = ChangelogChecker;
