export const API_BASE_URL = "https://t-a-d.onrender.com";

export const fetchTeachers = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/teachers`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching teachers:", error);
        return [];
    }
};

export const fetchRecordings = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/recordings`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching recordings:", error);
        return [];
    }
};
