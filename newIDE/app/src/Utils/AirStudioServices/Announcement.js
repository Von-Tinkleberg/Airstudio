// @flow
import axios from 'axios';
import { AirStudioReleaseApi } from './ApiConfigs';
import { type MessageByLocale } from '../i18n/MessageByLocale';
import { ensureIsArray } from '../DataValidator';

export type Announcement = {
  id: string,
  titleByLocale: MessageByLocale,
  markdownMessageByLocale: MessageByLocale,
  mobileMarkdownMessageByLocale?: MessageByLocale,
  type?: 'info' | 'warning',
  level: 'normal' | 'urgent',
  buttonUrl?: string,
  buttonLabelByLocale?: MessageByLocale,
};

export interface Promotion {
  id: string;
  imageUrl?: string;
  imageUrlByLocale?: MessageByLocale;
  mobileImageUrlByLocale?: MessageByLocale;
  display: 'all' | 'non-native-mobile' | 'native-mobile';
  type: 'game-template' | 'asset-pack' | 'game' | 'other';
  linkUrl?: string;
  productId?: string;
  fromDate?: number;
  toDate?: number;
}

export const listAllAnnouncements = async (): Promise<Array<Announcement>> => {
  try {
    // $FlowFixMe[underconstrained-implicit-instantiation]
    const response = await axios.get(
      `${AirStudioReleaseApi.baseUrl}/announcement`
    );
    return ensureIsArray({
      data: response.data,
      endpointName: '/announcement of Release API',
    });
  } catch (error) {
    return [];
  }
};

export const listAllPromotions = async (): Promise<Array<Promotion>> => {
  try {
    // $FlowFixMe[underconstrained-implicit-instantiation]
    const response = await axios.get(`${AirStudioReleaseApi.baseUrl}/promotion`);
    return ensureIsArray({
      data: response.data,
      endpointName: '/promotion of Release API',
    });
  } catch (error) {
    return [];
  }
};
