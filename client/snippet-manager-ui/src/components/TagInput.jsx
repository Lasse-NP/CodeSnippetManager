import React, { useState, useEffect, useRef, useMemo } from 'react';
import { TagsAPI } from '../api';
import './TagInput.css';

function TagInput({ value = "", onChange, placeholder = "Type to add tags..." }) {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [allTags, setAllTags] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
    const inputRef = useRef(null);
    const suggestionsRef = useRef(null);

    const tags = useMemo(() => {
        return Array.isArray(value) ? value : [];
    }, [value]);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const fetchedTags = await TagsAPI.getAllTags();
                setAllTags(fetchedTags);
            } catch (error) {
                console.error("Failed to fetch tags:", error);
                setAllTags([]);
            }
        };
        fetchTags();
    }, []);

    useEffect(() => {
        if (inputValue.trim()) {
            const filtered = allTags.filter(tag =>
                tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
                !tags.some(t => t.name === tag.name)
            );
            setSuggestions(filtered);
            setShowSuggestions(filtered.length > 0);
            setSelectedSuggestionIndex(-1);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, [inputValue, allTags, tags]);

    const addTag = (tag) => {
        let tagToAdd;

        // If tag is a string, create a new tag object
        if (typeof tag === 'string') {
            const trimmedTag = tag.trim();
            if (!trimmedTag) return;

            // Check if it exists in allTags
            const existingTag = allTags.find(t => t.name.toLowerCase() === trimmedTag.toLowerCase());
            tagToAdd = existingTag || { name: trimmedTag, snippetCount: 0 };
        } else {
            tagToAdd = tag;
        }

        // Check if already added
        if (tags.some(t => t.name === tagToAdd.name)) return;

        const newTags = [...tags, tagToAdd];
        if (onChange) {
            onChange(newTags);
        }


        setInputValue('');
        setShowSuggestions(false);
        inputRef.current?.focus();
    };

    const removeTag = (indexToRemove) => {
        const newTags = tags.filter((_, index) => index !== indexToRemove);
        if (onChange) {
            onChange(newTags);
        }
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedSuggestionIndex >= 0) {
                addTag(suggestions[selectedSuggestionIndex]);
            } else if (inputValue.trim()) {
                addTag(inputValue);
            };
        }

        else if (e.key === ' ' && inputValue.trim() || e.key === ',' && inputValue.trim()) {
            e.preventDefault();
            addTag(inputValue);
        }

        else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
            removeTag(tags.length - 1);
        }

        else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedSuggestionIndex(prev => (prev > 0 ? prev - 1 : 0));
        }

        else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedSuggestionIndex(prev => prev < suggestions.length - 1 ? prev + 1 : prev);
        }

        else if (e.key === 'Escape') {
            setShowSuggestions(false);
            setSelectedSuggestionIndex(-1);
        }
    };

    useEffect(() => {
        if (selectedSuggestionIndex >= 0 && suggestionsRef.current) {
            const selectedElement = suggestionsRef.current.children[selectedSuggestionIndex];
            if (selectedElement) {
                selectedElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'nearest'
                });
            }
        }
    }, [selectedSuggestionIndex]);

    const handleSuggestionClick = (tag) => {
        addTag(tag);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) && !inputRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div id="tags-input-container">
            <div id="tag-input-wrapper">
                {tags.map((tag, index) => (
                    <span key={tag.id || index} id={`tag-chip-${tag.id || index}`}>
                        {tag.name}
                        <button type="button" className="tag-remove-btn" id={`tag-remove-btn-${index}`} onClick={() => removeTag(index)}>X</button>
                    </span>
                ))}
                <input
                    ref={inputRef}
                    type="text"
                    id="tag-input-field"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder={tags.length === 0 ? placeholder : ''}
                />
            </div>
            {showSuggestions && (
                <ul id="tag-suggestions" ref={suggestionsRef}>
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={suggestion.id || index}
                            className={`suggestion-item ${index === selectedSuggestionIndex ? 'selected' : ''}`}
                            onClick={() => handleSuggestionClick(suggestion)}
                        >
                            {suggestion.name} ({suggestion.snippetCount})
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default TagInput;