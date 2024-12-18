"use client";

import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown'; // Import ReactMarkdown
import remarkGfm from 'remark-gfm'; // Import remarkGfm for GFM support


const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const TravelPlanner = () => {
    const [destination, setDestination] = useState('');
    const [duration, setDuration] = useState('');
    const [interests, setInterests] = useState('');
    const [budget, setBudget] = useState('');
    const [itinerary, setItinerary] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const generateItinerary = async () => {
        if (!destination || !duration || !interests || !budget) {
            alert('Please fill in all fields');
            return;
        }

        setIsLoading(true);

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            const prompt = `Create a detailed travel itinerary for a ${duration}-day trip to ${destination}. 
        Traveler interests: ${interests}. 
        Budget constraints: ${budget}. 
        Please provide a day-by-day breakdown including activities, estimated costs, and travel tips. Be super friendly and use lots of emojis.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = await response.text();

            setItinerary(text);
        } catch (error) {
            console.error('Error generating itinerary:', error);
            alert('Failed to generate itinerary. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            padding: '20px', display: 'flex', gap: '20px', maxWidth: '1200px', margin: '0 auto'
            , minHeight: '100vh' // Add this line
        }}> {/* Flex container */}
            <div style={{ flex: 1 }}> {/* Input area (left) */}
                <h1 style={{ fontSize: '2em', fontWeight: 'bold', marginBottom: '20px' }}>Travel Planner</h1>
                <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '20px' }}>
                    <h2 style={{ fontSize: '1.5em', marginBottom: '10px' }}>Plan Your Perfect Trip</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <input
                            type="text"
                            placeholder="Destination"
                            value={destination} // This was missing!
                            onChange={(e) => setDestination(e.target.value)}
                            style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        <input
                            type="text"
                            placeholder="Trip Duration (days)"
                            value={duration} // This was missing!
                            onChange={(e) => setDuration(e.target.value)}
                            style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        <input
                            type="text"
                            placeholder="Interests (e.g., history, food, nature)"
                            value={interests} // This was missing!
                            onChange={(e) => setInterests(e.target.value)}
                            style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        <input
                            type="text"
                            placeholder="Budget Range"
                            value={budget} // This was missing!
                            onChange={(e) => setBudget(e.target.value)}
                            style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />

                        <button
                            onClick={generateItinerary}
                            disabled={isLoading}
                            style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            {isLoading ? 'Generating...' : 'Generate Itinerary'}
                        </button>
                    </div>
                </div>
            </div>

            {itinerary && (
                <div style={{ flex: 2, border: '1px solid #ccc', borderRadius: '8px', padding: '20px', overflowY: 'auto', maxHeight: '80vh' }}> {/* Itinerary area (right), added scrolling */}
                    <h2 style={{ fontSize: '1.5em', marginBottom: '10px' }}>Your Personalized Itinerary</h2>
                    <ReactMarkdown
                        children={itinerary}
                        remarkPlugins={[remarkGfm]}
                        components={{
                            h1: ({ node, ...props }) => <h1 style={{ fontSize: "2em" }} {...props} />,
                            h2: ({ node, ...props }) => <h2 style={{ fontSize: "1.5em" }} {...props} />,
                            h3: ({ node, ...props }) => <h3 style={{ fontSize: "1.2em" }} {...props} />,
                            // Add more customizations as needed
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default TravelPlanner;