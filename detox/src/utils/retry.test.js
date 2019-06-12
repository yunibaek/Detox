describe('retry', () => {
  let logger;
  let retry;

  beforeEach(() => {
    const mockLogger = {
      debug: jest.fn(),
    };
    jest.mock('./logger', () => ({
      child: () => mockLogger
    }));
    logger = mockLogger;

    retry = require('./retry');
  });

  it(`a promise that rejects two times and then resolves, with default params`, async() => {
    const mockFnc = jest.fn()
                        .mockReturnValueOnce(Promise.reject())
                        .mockReturnValueOnce(Promise.resolve());
    await retry(mockFnc);
    expect(mockFnc).toHaveBeenCalledTimes(2);
  });

  it(`a promise that rejects two times and then resolves, with custom params`, async() => {
    const mockFnc = jest.fn()
                        .mockReturnValueOnce(Promise.reject())
                        .mockReturnValueOnce(Promise.resolve());
    await retry({retries: 2, interval: 1}, mockFnc);
    expect(mockFnc).toHaveBeenCalledTimes(2);
  });

  it(`a promise that rejects two times, with two retries`, async() => {
    const mockFn = jest.fn()
                       .mockReturnValue(Promise.reject(new Error('a thing')));
    try {
      await retry({retries: 2, interval: 1}, mockFn);
      fail('expected retry to fail to throw');
    } catch (object) {
      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(object).toBeDefined();
    }
  });

  it('should be verbose if log event is specified', async() => {
    const errorMessage = 'mock message';
    const logEvent = 'MOCK_EVENT';
    const mockFnc = jest.fn()
                        .mockReturnValueOnce(Promise.reject(new Error(errorMessage)))
                        .mockReturnValueOnce(Promise.resolve());
    await retry({retries: 2, interval: 1, logEvent}, mockFnc);

    expect(logger.debug).toHaveBeenCalledWith({event: logEvent}, errorMessage);
    expect(logger.debug).toHaveBeenCalledTimes(1);
  });

  it('should be silent if log event hasn\'t been specified', async() => {
    const mockFnc = jest.fn()
      .mockReturnValueOnce(Promise.reject(new Error('a message')))
      .mockReturnValueOnce(Promise.resolve());
    await retry({retries: 2, interval: 1, logEvent: undefined}, mockFnc);

    expect(logger.debug).not.toHaveBeenCalled();
  });
});
