import http from '@/utils/http';

/**
 * 此文本标签下的所有文章
 *
 * RestBeanListTrainTextVO
 */
export type GetTrainTextByCategoryResType = {
  /**
   * 状态码
   */
  code?: number;
  /**
   * 响应数据
   */
  data?: TrainTextVO[];
  id?: number;
  /**
   * 其他消息
   */
  message?: string;
  [property: string]: any;
}

/**
* com.example.entity.vo.response.TrainTextVO
*
* TrainTextVO
*/
export type TrainTextVO = {
  applicablePeople?: string;
  author?: string;
  category?: string;
  grade?: string;
  suggestedDuration?: string;
  text?: string;
  title?: string;
  [property: string]: any;
}

export const GetTrainTextByCategoryAPI = async (category: string) => {
  try {
    const response = await http<GetTrainTextByCategoryResType>({
      url: '/trainText/getTrainTextByCategory',
      method: 'GET',
      params: {
        category,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * 音频文件base64编码，byte[]，mp3格式
 *
 * RestBeanTtsVO
 */
export type GetTTSAPIResType = {
  /**
   * 状态码
   */
  code?: number;
  /**
   * 响应数据
   */
  data?: TtsVO;
  id?: number;
  /**
   * 其他消息
   */
  message?: string;
  [property: string]: any;
}

/**
* 响应数据
*
* TtsVO
*/
export type TtsVO = {
  audioBase64?: number[];
  [property: string]: any;
}

export const GetTTSAPI = async (text: string) => {
  try {
    const response = await http<GetTTSAPIResType>({
      url: '/dysarthria/getTTS',
      method: 'POST',
      data: {
        text,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const GetMicrosoftTTSAPI = async (text: string, language: string, voice: string) => {
  try {
    const response = await http({
      url: `https://eastasia.tts.speech.microsoft.com/cognitiveservices/v1`,
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
      },
      data: `
        <speak version='1.0' xml:lang='${language}'>
          <voice xml:lang='${language}' xml:gender='Female' name='${voice}'>
            ${text}
          </voice>
        </speak>
      `,
      responseType: 'arraybuffer',
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const DysarthriaAPI = async (text: string, audioFile: File) => {
  try {
    const formData = new FormData();
    formData.append('audioFile', audioFile);
    const response = await http({
      url: '/dysarthria/getResult',
      method: 'POST',
      params: {
        text
      },
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}