// @flow
/**
 * AsyncMultiplayer Extension - Main Entry Point
 */

import ExtensionInfo from './ExtensionInfo';
import AsyncMultiplayerBehavior from './AsyncMultiplayerBehavior';
import conditions from './Conditions';
import actions from './Actions';
import expressions from './Expressions';
import AsyncMultiplayerRuntimeBehavior from './AsyncMultiplayerRuntimeBehavior';

const extension = {
    info: ExtensionInfo,
    behavior: {
        AsyncMultiplayerBehavior,
    },
    conditions,
    actions,
    expressions,
    runtimeBehavior: AsyncMultiplayerRuntimeBehavior,
};

export default extension;