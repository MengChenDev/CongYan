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