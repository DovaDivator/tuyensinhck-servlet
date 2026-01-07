interface Unit {
    [key: string]: string;
}

export const setFreeze = async (token: string, dataToSend: Unit): Promise<any> => {
    try {
        const response = await fetch('/api/users-edit?type=freeze', {
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

export const deleteCccd = async (token: string, dataToSend: Unit): Promise<any> => {
    try {
        const response = await fetch('/api/users-edit?type=delete-cccd', {
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

export const deleteThiSinh = async (token: string, dataToSend: Unit): Promise<any> => {
    try {
        const response = await fetch('/api/users-edit?type=delete-stu', {
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

export const updateGVMon = async (token: string, dataToSend: Unit): Promise<any> => {
    try {
        const response = await fetch('/api/users-edit?type=update-gv-mon', {
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

export const addGVtoDB = async (token: string, dataToSend: Unit): Promise<any> => {
    try {
        const response = await fetch('/api/add?type=teacher', {
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