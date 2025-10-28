let currentServer = 'Remote';

const getBaseURL = () => {
    return currentServer === 'Local'
        ? 'https://localhost:7001/api'  // or your SQLExpress URL
        : 'http://192.168.0.139:5000/api';
};

export const setServer = (server) => {
    currentServer = server;
    console.log(`Switched to ${server} server: ${getBaseURL()}`);
};

export const snippetsAPI = {
    // Get all snippets
    getAllSnippets: async () => {
        const response = await fetch(`${getBaseURL()}/snippets`);
        if (!response.ok) {
            throw new Error('Failed to fetch snippets');
        }
        return response.json();
    },

    // Get a single snippet by ID
    getSnippetById: async (id) => {
        const response = await fetch(`${getBaseURL()}/snippets/${id}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch snippet ${id}`);
        }
        return response.json();
    },

    // Create a new snippet
    createSnippet: async (snippetData) => {
        const response = await fetch(`${getBaseURL()}/snippets`, {
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
        const response = await fetch(`${getBaseURL()}/snippets/${id}`, {
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
        const response = await fetch(`${getBaseURL()}/snippets/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Failed to delete snippet ${id}`);
        }
        return response.status === 204;
    },

    // Search snippets by query
    searchSnippets: async (query) => {
        const response = await fetch(`${getBaseURL()}/snippets/search?query=${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error('Failed to search snippets');
        }
        return response.json();
    },
};
