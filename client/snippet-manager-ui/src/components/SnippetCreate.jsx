import React, { useState } from "react";
import { snippetsAPI } from '../api';
import './SnippetCreate.css';

export default function SnippetCreate({ onCreate, onCancel }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [language, setLanguage] = useState("");
    const [code, setCode] = useState("");
    const [tags, setTags] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    function validate() {
        if (!title.trim()) return "Title is required.";
        if (!code) return "Code is required.";
        if (!language.trim()) return "Language is required.";
        if (!tags.trim()) return "At least one tag is required.";
        else return null;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);

        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        const payload = {
            title: title.trim(),
            code: code,
            language: language.trim(),
            description: description.trim(),
            tags: tags.split(",").map(t => t.trim()).filter(Boolean)
        }

        setLoading(true);
        try {
            const newSnippet = await snippetsAPI.createSnippet(payload);
            onCreate && onCreate(newSnippet);
        }
        catch (err) {
            setError(err.message || "An error occurred while creating the snippet.");
            console.error("Error creating snippet:", err);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className="snippet-create">
            <h2>Create New Snippet</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="attributes">
                <label>
                    Title:
                    <input
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                </label>
                <label>
                    Description:
                    <input
                        type="text"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                </label>
                <label>
                    Language:
                    <input
                        type="text"
                        value={language}
                        onChange={e => setLanguage(e.target.value)}
                    />
                    </label>
                </div>
                <div className="main-body">
                <label>
                    Code:
                    <textarea
                        value={code}
                        onChange={e => setCode(e.target.value)}
                        rows={10}
                    />
                    </label>
                </div>
                <div className="tags">
                <label>
                    Tags:
                    <input
                        type="text"
                        value={tags}
                        onChange={e => setTags(e.target.value)}
                        placeholder="react, javascript, hooks"
                    />
                    </label>
                </div>
                <div className="button-create-group">
                    <button className="btn-create" type="submit" disabled={loading}>
                        {loading ? "Creating..." : "Create"}
                    </button>
                    {onCancel && (
                        <button className="btn-cancel" type="button" onClick={onCancel} disabled={loading}>
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}