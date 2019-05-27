const { noop } = require('lodash');

class DetoxMochaAdapter {
  constructor(detox) {
    this.skip = this.skip.bind(this);

    this._originalSkip = noop;
    this._lastContext = {};
    this.detox = detox;
  }

  skip(...args) {
    this.afterEach(this._lastContext);
    this._originalSkip(...args);
  }

  async beforeEach(context) {
    this._lastContext = { ...context };

    if (context.skip !== this.skip) {
      this._originalSkip = context.skip.bind(context);
      context.skip = this.skip;
    }

    await this.detox.beforeEach({
      title: context.currentTest.title,
      fullName: context.currentTest.fullTitle(),
      status: this._mapStatus(context, false),
    });
  }

  async afterEach(context) {
    this._lastContext = { ...context };

    await this.detox.afterEach({
      title: context.currentTest.title,
      fullName: context.currentTest.fullTitle(),
      status: this._mapStatus(context, true),
    });
  }

  _mapStatus(context, isAfterTest) {
    switch (context.currentTest.state) {
      case 'passed':
        return 'passed';
      case 'failed':
        return 'failed';
      default:
        return isAfterTest ? 'failed' : 'running';
    }
  }
}

module.exports = DetoxMochaAdapter;
