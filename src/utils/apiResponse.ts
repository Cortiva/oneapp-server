interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  error?: string;
  errorDetails?: any[];
}

export class ApiResponseBuilder {
  static success<T>(
    data: T,
    message: string = "Success",
    statusCode: number = 201
  ): ApiResponse<T> {
    return {
      success: true,
      statusCode,
      message,
      data,
    };
  }

  static error(
    message: string,
    statusCode: number = 400,
    errorDetails?: any[]
  ): ApiResponse<null> {
    return {
      success: false,
      statusCode,
      message,
      error: message,
      errorDetails,
    };
  }
}
