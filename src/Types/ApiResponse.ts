interface ApiResponse {
    status: number;
    success: boolean;
    message?: string;
    data?: any;
}

export default ApiResponse;
