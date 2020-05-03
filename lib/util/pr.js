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
class PrService {
    constructor(_octokit, _config, _githubContext) {
        this._octokit = _octokit;
        this._config = _config;
        this._githubContext = _githubContext;
    }
    searchFile(pr) {
        return __awaiter(this, void 0, void 0, function* () {
            const regex = new RegExp(this._config.changelogPattern);
            const files = yield this._octokit.pulls.listFiles(Object.assign(Object.assign({}, this._githubContext.repo), { 
                // eslint-disable-next-line @typescript-eslint/camelcase
                pull_number: pr }));
            return files.data.find((value) => regex.test(value.filename));
        });
    }
    getLabelsForCurrentPr() {
        return __awaiter(this, void 0, void 0, function* () {
            const pr = this.getPr();
            return Promise.all(pr.labels.map((it) => __awaiter(this, void 0, void 0, function* () { return it.name; })));
        });
    }
    addCommentToPr() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            this._octokit.issues.createComment(Object.assign(Object.assign({}, github.context.repo), { 
                // eslint-disable-next-line @typescript-eslint/camelcase
                issue_number: (_b = (_a = this.getPr().pull_request) === null || _a === void 0 ? void 0 : _a.number, (_b !== null && _b !== void 0 ? _b : 0)), body: this._config.missingChangelogMessage }));
        });
    }
    addLabelToCurrentPr() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            this._octokit.issues.addLabels(Object.assign(Object.assign({}, github.context.repo), { 
                // eslint-disable-next-line @typescript-eslint/camelcase
                issue_number: (_b = (_a = this.getPr().pull_request) === null || _a === void 0 ? void 0 : _a.number, (_b !== null && _b !== void 0 ? _b : 0)), labels: [this._config.noChangelogLabel] }));
        });
    }
    getPr() {
        const pr = this._githubContext.payload.pull_request;
        if (pr) {
            return pr;
        }
        else {
            throw new Error('Not a PR');
        }
    }
}
exports.PrService = PrService;
