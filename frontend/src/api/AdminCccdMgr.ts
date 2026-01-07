interface Unit {
    [key: string]: any;
}

export const UpdateCccd = async (token: string, dataToSend: Unit): Promise<any> => {
    try {
        const response = await fetch('/api/admin-cccd-mgr?action=accept', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(dataToSend),
            credentials: 'include'   // <-- BẮT BUỘC để gửi JSESSIONID
        });
        const text = await response.text();
        const result = await JSON.parse(text);
        if (!response.ok) {
            const errorJson = {
                status: response.status,
                message: result.message
            };
            console.error(errorJson);
            throw errorJson;
        }
        // console.log('Phản hồi từ servlet:', result);
        return result;

    } catch (error) {
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
            throw {
                status: 503,
                message: 'Không thể kết nối đến máy chủ.'
            };
        }
        throw error;
    }
};

export const GetCccd = async (token: string, dataToSend: Unit): Promise<any> => {
    try {
        const response = await fetch('/api/admin-cccd-mgr?action=select', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(dataToSend),
            credentials: 'include'   // <-- BẮT BUỘC để gửi JSESSIONID
        });
        const text = await response.text();
        const result = await JSON.parse(text);
        if (!response.ok) {
            const errorJson = {
                status: response.status,
                message: result.message
            };
            console.error(errorJson);
            throw errorJson;
        }
        // console.log('Phản hồi từ servlet:', result);
        return result;

    } catch (error) {
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
            throw {
                status: 503,
                message: 'Không thể kết nối đến máy chủ.'
            };
        }
        throw error;
    }
};

export const DeniedCccd = async (token: string, dataToSend: Unit): Promise<any> => {
    try {
        const response = await fetch('/api/admin-cccd-mgr?action=denied', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(dataToSend),
            credentials: 'include'   // <-- BẮT BUỘC để gửi JSESSIONID
        });
        const text = await response.text();
        const result = await JSON.parse(text);
        if (!response.ok) {
            const errorJson = {
                status: response.status,
                message: result.message
            };
            console.error(errorJson);
            throw errorJson;
        }
        // console.log('Phản hồi từ servlet:', result);
        return result;

    } catch (error) {
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
            throw {
                status: 503,
                message: 'Không thể kết nối đến máy chủ.'
            };
        }
        throw error;
    }
};

export const RemoveCccd = async (token: string, dataToSend: Unit): Promise<any> => {
    try {
        const response = await fetch('/api/admin-cccd-mgr?action=delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(dataToSend),
            credentials: 'include'   // <-- BẮT BUỘC để gửi JSESSIONID
        });
        const text = await response.text();
        const result = await JSON.parse(text);
        if (!response.ok) {
            const errorJson = {
                status: response.status,
                message: result.message
            };
            console.error(errorJson);
            throw errorJson;
        }
        // console.log('Phản hồi từ servlet:', result);
        return result;

    } catch (error) {
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
            throw {
                status: 503,
                message: 'Không thể kết nối đến máy chủ.'
            };
        }
        throw error;
    }
};