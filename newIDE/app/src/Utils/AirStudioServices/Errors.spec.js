// @flow
import { extractAirStudioApiErrorStatusAndCode } from './Errors';

describe('Errors', () => {
  test('Can extract status and code from a AirStudio API error', () => {
    // $FlowFixMe[incompatible-type] - faking error objects to test the function resilience.
    expect(extractAirStudioApiErrorStatusAndCode(undefined)).toEqual(null);
    expect(
      extractAirStudioApiErrorStatusAndCode(new Error('Generic error'))
    ).toEqual(null);
    // $FlowFixMe[incompatible-type] - faking error objects to test the function resilience.
    expect(extractAirStudioApiErrorStatusAndCode({})).toEqual(null);
    // $FlowFixMe[incompatible-type] - faking error objects to test the function resilience.
    expect(extractAirStudioApiErrorStatusAndCode({ response: null })).toEqual(
      null
    );
    // $FlowFixMe[incompatible-type] - faking error objects to test the function resilience.
    expect(extractAirStudioApiErrorStatusAndCode({ response: {} })).toEqual(
      null
    );
    expect(
      // $FlowFixMe[incompatible-type] - faking error objects to test the function resilience.
      extractAirStudioApiErrorStatusAndCode({ response: { status: 'wrong' } })
    ).toEqual(null);
    expect(
      // $FlowFixMe[incompatible-type] - faking error objects to test the function resilience.
      extractAirStudioApiErrorStatusAndCode({ response: { status: 400 } })
    ).toEqual({ status: 400, code: null, data: null });
    expect(
      // $FlowFixMe[incompatible-type] - faking error objects to test the function resilience.
      extractAirStudioApiErrorStatusAndCode({
        response: { status: 400, data: null },
      })
    ).toEqual({ status: 400, code: null, data: null });
    expect(
      // $FlowFixMe[incompatible-type] - faking error objects to test the function resilience.
      extractAirStudioApiErrorStatusAndCode({
        response: { status: 400, data: {} },
      })
    ).toEqual({ status: 400, code: null, data: null });
    expect(
      // $FlowFixMe[incompatible-type] - faking error objects to test the function resilience.
      extractAirStudioApiErrorStatusAndCode({
        response: { status: 400, data: { code: 0xbad } },
      })
    ).toEqual({ status: 400, code: null, data: null });
    expect(
      // $FlowFixMe[incompatible-type] - faking error objects to test the function resilience.
      extractAirStudioApiErrorStatusAndCode({
        response: { status: 400, data: { code: 'code/of-the-error' } },
      })
    ).toEqual({ status: 400, code: 'code/of-the-error', data: null });
    expect(
      // $FlowFixMe[incompatible-type] - faking error objects to test the function resilience.
      extractAirStudioApiErrorStatusAndCode({
        response: {
          status: 400,
          data: { code: 'code/of-the-error', data: 'errorData' },
        },
      })
    ).toEqual({ status: 400, code: 'code/of-the-error', data: null });
    expect(
      // $FlowFixMe[incompatible-type] - faking error objects to test the function resilience.
      extractAirStudioApiErrorStatusAndCode({
        response: {
          status: 400,
          data: { code: 'code/of-the-error', data: { any: 'objet' } },
        },
      })
    ).toEqual({
      status: 400,
      code: 'code/of-the-error',
      data: { any: 'objet' },
    });
  });
});
