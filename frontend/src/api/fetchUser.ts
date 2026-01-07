export const fetchUsers = async ({
    token = "",
    type = "tai-khoan",
    search = "",
    params = {},
    page = 1,
}: {
    token?: string;
    type?: string;
    search?: string;
    page?: number
    params?: { [key: string]: string | string[] | undefined }
}) => {
    const query = new URLSearchParams();

    query.append("type", type);
    if (search) query.append("search", search);
    query.append("page", String(page));

    if (params) {
        for (const key in params) {
            const value = params[key];

            if (Array.isArray(value)) {
                value.forEach(v => {
                    if (v !== undefined) query.append(key, v);
                });

            } else if (typeof value === 'string') {
                query.append(key, value);
            }
            // nếu value === undefined thì bỏ qua
        }
    }

    try {
        const res = await fetch(`/api/fetch-users?${query.toString()}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            credentials: 'include'
        });
        const text = await res.text();
        const result = await JSON.parse(text);

        if (!res.ok) {
            const errorJson = {
                status: res.status,
                message: result.message
            };
            console.error(errorJson);
            throw errorJson;
        }

        return await result;
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

export const fetchUsersPagination = async ({
    token = "",
    type = "tai-khoan",
    search = "",
    params = {},
    page = 1,
}: {
    token?: string;
    type?: string;
    search?: string;
    page?: number
    params?: { [key: string]: string | string[] | undefined }
}) => {
    const query = new URLSearchParams();

    query.append("type", type);
    if (search) query.append("search", search);
    query.append("page", String(page));

    if (params) {
        for (const key in params) {
            const value = params[key];

            if (Array.isArray(value)) {
                value.forEach(v => {
                    if (v !== undefined) query.append(key, v);
                });

            } else if (typeof value === 'string') {
                query.append(key, value);
            }
            // nếu value === undefined thì bỏ qua
        }
    }

    try {
        const res = await fetch(`/api/users-manager-pagination?${query.toString()}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            credentials: 'include'
        });
        const text = await res.text();
        const result = await JSON.parse(text);

        if (!res.ok) {
            const errorJson = {
                status: res.status,
                message: result.message
            };
            console.error(errorJson);
            throw errorJson;
        }

        return await result;
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

export const fetchUsersDropdownItems = async ({
    token = "",
    type = "",
}: {
    token?: string;
    type?: string;
}) => {
    const query = new URLSearchParams();

    query.append("type", type);

    try {
        const res = await fetch(`/api/users-dropdown?${query.toString()}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            credentials: 'include'
        });
        const text = await res.text();
        const result = await JSON.parse(text);

        if (!res.ok) {
            const errorJson = {
                status: res.status,
                message: result.message
            };
            console.error(errorJson);
            throw errorJson;
        }

        return await result;
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
