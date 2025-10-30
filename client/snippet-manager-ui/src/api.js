let currentServer = 'Remote';
let apiKey = 'KzqLnTt23pcILLViOfpMfju5TU+mxQwncJnFc1g7F/c=';

const getBaseURL = () => {
    return currentServer === 'Local'
        ? 'https://localhost:7001/api'  // or your SQLExpress URL
        : 'https://api.snippetmanager.work/api';
};

const getHeaders = (includeContentType = true) => {
    const headers = {
        'X-Api-Key': apiKey,
    };
    if (includeContentType) {
        headers['Content-Type'] = 'application/json';
    }
    return headers;
};

export const setServer = (server) => {
    currentServer = server;
    console.log(`Switched to ${server} server: ${getBaseURL()}`);
};

export const setApiKey = (key) => {
    apiKey = key;
    console.log('API key updated');
};

export const snippetsAPI = {
    // Get all snippets
    getAllSnippets: async () => {
        const response = await fetch(`${getBaseURL()}/snippets`, {
            headers: getHeaders(false),
        });
        if (!response.ok) {
            throw new Error('Failed to fetch snippets');
        }
        return response.json();
    },

    // Get a single snippet by ID
    getSnippetById: async (id) => {
        const response = await fetch(`${getBaseURL()}/snippets/${id}`, {
            headers: getHeaders(false),
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch snippet ${id}`);
        }
        return response.json();
    },

    // Create a new snippet
    createSnippet: async (snippetData) => {
        const response = await fetch(`${getBaseURL()}/snippets`, {
            method: 'POST',
            headers: getHeaders(false),
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
            headers: getHeaders(false),
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
            headers: getHeaders(false),
        });
        if (!response.ok) {
            throw new Error(`Failed to delete snippet ${id}`);
        }
        return response.status === 204;
    },

    // Search snippets by query
    searchSnippets: async (query) => {
        const response = await fetch(`${getBaseURL()}/snippets/search?query=${encodeURIComponent(query)}`, {
            headers: getHeaders(false),
        });
        if (!response.ok) {
            throw new Error('Failed to search snippets');
        }
        return response.json();
    },
};

export const TagsAPI = {
    // Get all tags
    getAllTags: async () => {
        const response = await fetch(`${getBaseURL()}/tags`, {
            headers: getHeaders(false),
        });
        if (!response.ok) {
            throw new Error('Failed to fetch tags');
        }
        return response.json();
    },

    // Get tag by ID
    getTagById: async (id) => {
        const response = await fetch(`${getBaseURL()}/tags/byId/${id}`, {
            headers: getHeaders(false),
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch tag ${id}`);
        }
        return response.json();
    },

    // Get tag by name
    getTagByName: async (name) => {
        const response = await fetch(`${getBaseURL()}/tags/byName/${encodeURIComponent(name)}`, {
            headers: getHeaders(false),
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch tag ${name}`);
        }
        return response.json();
    },

    // Create a new tag
    createTag: async (tagData) => {
        const response = await fetch(`${getBaseURL()}/tags`, {
            method: 'POST',
            headers: getHeaders(false),
            body: JSON.stringify(tagData),
        });
        if (!response.ok) {
            throw new Error('Failed to create tag');
        }
        return response.json();
    },

    // Update an existing tag
    updateTag: async (id, tagData) => {
        const response = await fetch(`${getBaseURL()}/tags/${id}`, {
            method: 'PUT',
            headers: getHeaders(false),
            body: JSON.stringify(tagData),
        });
        if (!response.ok) {
            throw new Error(`Failed to update tag ${id}`);
        }
        return response.json();
    },

    // Delete a tag
    deleteTag: async (id) => {
        const response = await fetch(`${getBaseURL()}/tags/${id}`, {
            method: 'DELETE',
            headers: getHeaders(false),
        });
        if (!response.ok) {
            throw new Error(`Failed to delete tag ${id}`);
        }
        return response.status === 204;
    },
};
