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
        return typeof value === 'string'
            ? value.split(',').map(tag => tag.trim()).filter(Boolean)
            : [];
    }, [value]);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const fetchedTags = await TagsAPI.getAllTags();
                setAllTags(fetchedTags.map(tag => tag.name));
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
                tag.toLowerCase().includes(inputValue.toLowerCase()) &&
                !tags.includes(tag)
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
        const trimmedTag = tag.trim();
        if (trimmedTag && !tags.includes(trimmedTag)) {
            const newTags = [...tags, trimmedTag];
            const tagsString = newTags.join(', ');
            if (onChange) {
                onChange(tagsString);
            }
        }
        setInputValue('');
        setShowSuggestions(false);
        inputRef.current?.focus();
    };

    const removeTag = (indexToRemove) => {
        const newTags = tags.filter((_, index) => index !== indexToRemove);
        const tagsString = newTags.join(', ');
        if (onChange) {
            onChange(tagsString);
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
            setSelectedSuggestionIndex(prev => prev < suggestions.length - 1 ? prev + 1 : prev);
        }

        else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedSuggestionIndex(prev => (prev > 0 ? prev - 1 : -1));
        }

        else if (e.key === 'Escape') {
            setShowSuggestions(false);
            setSelectedSuggestionIndex(-1);
        }
    };

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
                    <span key={index} id={`tag-chip-${index}`}>
                        {tag}
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
                            key={suggestion}
                            className={`suggestion-item ${index === selectedSuggestionIndex ? 'selected' : ''}`}
                            onClick={() => handleSuggestionClick(suggestion)}
                            onMouseEnter={() => setSelectedSuggestionIndex(index)}
                        >
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default TagInput;