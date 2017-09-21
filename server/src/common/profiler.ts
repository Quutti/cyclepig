

export interface ILogger {
    log: (...args) => void;
}

interface ProfilerStep {
    time: number;
    msg: string;
}

export class Profiler {

    private _steps: ProfilerStep[] = [];
    private _logger: ILogger = null;

    constructor(logger: ILogger) {
        this._logger = logger;
    }

    public start(msg: string) {
        this._steps = [];
        this._addStep(msg);
    }

    public step(msg: string) {
        this._addStep(msg);
    }

    public stop(msg: string) {
        this._addStep(msg);
        this._output();
    }

    private _addStep(msg: string) {
        this._steps.push({
            msg,
            time: Date.now()
        });
    }

    private _output() {
        if (this._steps.length === 0) {
            this._logger.log('[Profiler] Step count 0');
            return;
        }

        const lastIndex = this._steps.length - 1;
        const startTime = this._steps[0].time;

        this._logger.log('---- ---- ---- ----');
        this._logger.log('[Profile]');

        for (let i = 0; i < this._steps.length; i++) {
            const step = this._steps[i];
            const ellapsedMs = step.time - startTime;
            this._logger.log(`[${ellapsedMs}ms] ${step.msg}`);
        }

        this._logger.log('[/Profile]');
        this._logger.log('---- ---- ---- ----');
    }
}