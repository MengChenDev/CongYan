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
    const response = await http<DysarthriaResType>({
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




export const DysarthriaByBase64API = async (text: string, audioBase64: string) => {
  try {
    const response = await http({
      url: '/dysarthria/getResultByBase64',
      method: 'POST',
      data: {
        audioBase64,
        text
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}



/**
 * 返回每个汉字的详细发音信息
 *
 * RestBeanDysarthriaResultVO
 */
export type DysarthriaResType = {
  /**
   * 状态码
   */
  code?: number;
  /**
   * 响应数据
   */
  data?: DysarthriaResultVO;
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
* DysarthriaResultVO
*/
export type DysarthriaResultVO = {
  sd?: Sd[];
  single_score?: number[];
  sm?: Sm[];
  total_score?: number;
  ym?: Ym[];
  [property: string]: any;
}

export enum Sd {
  SDDifferent = "SD_DIFFERENT",
  SDSame = "SD_SAME",
}

export enum Sm {
  SmDiffMethod = "SM_DIFF_METHOD",
  SmDiffPart = "SM_DIFF_PART",
  SmDifferent = "SM_DIFFERENT",
  SmSame = "SM_SAME",
}

export enum Ym {
  YmDiffShape = "YM_DIFF_SHAPE",
  YmDiffShapeAndSmooth = "YM_DIFF_SHAPE_AND_SMOOTH",
  YmDiffSmooth = "YM_DIFF_SMOOTH",
  YmDiffStruct = "YM_DIFF_STRUCT",
  YmDifferent = "YM_DIFFERENT",
  YmSame = "YM_SAME",
  YmSameLike = "YM_SAME_LIKE",
}

// export const DysarthriaAPI = async (text: string, audioBase64: string) => {
//   try {
//     const response = await http({
//       url: '/dysarthria/getResult',
//       method: 'POST',
//       params: {
//         text
//       },
//       data: {
//         audioBase64
//       },
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// }


// export const generateRandomEnumValue = <T extends object>(enumObj: T): T[keyof T] => {
//   const enumValues = Object.values(enumObj);
//   const randomIndex = Math.floor(Math.random() * enumValues.length);
//   return enumValues[randomIndex];
// };

// export const MockDysarthriaAPI = async () => {
//   const mockText = "在腊八这天";
//   const mockAudioBase64 = "U29tZUJhc2U0RW5jb2RlZFN0cmluZw=="; // This is a placeholder base64 string

//   const textLength = mockText.length;

//   const mockResponse: DysarthriaResType = {
//     code: 200,
//     data: {
//       sd: Array.from({ length: textLength }, () => generateRandomEnumValue(Sd)),
//       single_score: Array.from({ length: textLength }, () => Math.floor(Math.random() * 100)),
//       sm: Array.from({ length: textLength }, () => generateRandomEnumValue(Sm)),
//       total_score: Math.floor(Math.random() * 100),
//       ym: Array.from({ length: textLength }, () => generateRandomEnumValue(Ym)),
//     },
//     id: 1,
//     message: "Success",
//   };

//   return mockResponse;
// };