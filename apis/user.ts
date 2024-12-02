import http from "@/utils/http";

/**
 * 是否请求成功
 *
 * RestBeanVoid
 */
export type RequestVerificationCodeResType = {
  /**
   * 状态码
   */
  code?: number;
  /**
   * 响应数据
   */
  data?: null;
  id?: number;
  /**
   * 其他消息
   */
  message?: string;
  [property: string]: any;
}

export const RequestVerificationCodeAPI = async (email: string, type: "register" | "reset") => {
  try {
    const response = await http<RequestVerificationCodeResType>({
      url: "/auth/ask-code",
      method: "GET",
      params: {
        email,
        type,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * 是否注册成功
 *
 * RestBeanVoid
 */
export type RegisterResType = {
  /**
   * 状态码
   */
  code?: number;
  /**
   * 响应数据
   */
  data?: null;
  id?: number;
  /**
   * 其他消息
   */
  message?: string;
  [property: string]: any;
}

export const RegisterAPI = async (email: string, code: string, username: string, password: string) => {
  try {
    const response = await http<RegisterResType>({
      url: "/auth/register",
      method: "POST",
      data: {
        email,
        code,
        username,
        password,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export type LoginResType = {
  code: number;
  data: UserData;
  id: number;
  message: string;
  [property: string]: any;
}

export type UserData = {
  expire: string;
  role: string;
  token: string;
  username: string;
  [property: string]: any;
}

export const LoginAPI = async (account: string, password: string) => {
  try {
    const formData = new FormData();
    formData.append("username", account);
    formData.append("password", password);

    const response = await http<LoginResType>({
      url: "/auth/login",
      method: "POST",
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