const API_BASE_URL = 'https://localhost:7001/api'

const fetchWithRetry = async (url, options = {}, maxRetries = 3) => {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response;
        } catch (error) {
            // If this was the last attempt, throw the error
            if (attempt === maxRetries) {
                throw error;
            }

            // Calculate delay: 1s, 2s, 4s, 8s...
            const delay = Math.pow(2, attempt) * 1000;
            console.log(`Attempt ${attempt + 1} failed. Retrying in ${delay}ms...`);

            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
};

export const snippetsAPI = {
    // Get all snippets
    getAllSnippets: async () => {
        const response = await fetch(`${API_BASE_URL}/snippets`);
        if (!response.ok) {
            throw new Error('Failed to fetch snippets');
        }
        return response.json();
    },

    // Get a single snippet by ID
    getSnippetById: async (id) => {
        const response = await fetch(`${API_BASE_URL}/snippets/${id}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch snippet ${id}`);
        }
        return response.json();
    },

    // Create a new snippet
    createSnippet: async (snippetData) => {
        const response = await fetch(`${API_BASE_URL}/snippets`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(snippetData),
        });
        if (!response.ok) {
            throw new Error('Failed to create snippet');
        }
        return response.json();
    },

    // Update an existing snippet
    updateSnippet: async (id, snippetData) => {
        const response = await fetch(`${API_BASE_URL}/snippets/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(snippetData),
        });
        if (!response.ok) {
            throw new Error(`Failed to update snippet ${id}`);
        }
        return response.json();
    },

    // Delete a snippet
    deleteSnippet: async (id) => {
        const response = await fetch(`${API_BASE_URL}/snippets/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Failed to delete snippet ${id}`);
        }
        return response.status === 204;
    },

    // Search snippets by query
    searchSnippets: async (query) => {
        const response = await fetch(`${API_BASE_URL}/snippets/search?query=${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error('Failed to search snippets');
        }
        return response.json();
    },
};
