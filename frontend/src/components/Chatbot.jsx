import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';
import { Modal, Form, Button } from 'react-bootstrap';
import { ChatDotsFill, SendFill, Robot } from 'react-bootstrap-icons';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

function Chatbot() {
    const [show, setShow] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'bot', text: "Hello! How can I help you with your travel plans today?" }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatboxRef = useRef(null);
    const genAI = new GoogleGenerativeAI(API_KEY);

    useEffect(() => {
        if (chatboxRef.current) {
            chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSend = async () => {
        if (inputValue.trim() === '') return;
        const userInput = inputValue.trim();
        setMessages(prev => [...prev, { sender: 'user', text: userInput }]);
        setInputValue('');
        setIsLoading(true);
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
            const prompt = `You are 'Let's Go', a helpful flight booking assistant for a Pakistani travel website. Answer the user's question about flights, travel in Pakistan, or general queries in a friendly and helpful tone. User's question: "${userInput}"`;
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            setMessages(prev => [...prev, { sender: 'bot', text }]);
        } catch (error) {
            console.error("Gemini AI Error:", error);
            setMessages(prev => [...prev, { sender: 'bot', text: "Sorry, I'm having trouble connecting right now." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button className="chatbot-toggler" onClick={() => setShow(true)}>
                <ChatDotsFill size={24} />
            </button>

            <Modal show={show} onHide={() => setShow(false)} centered contentClassName="chatbot-modal">
                <Modal.Header closeButton>
                    <div className="h5 w-100 text-center mb-0">
                        <Robot className="me-2" style={{ verticalAlign: 'middle' }}/>
                        Let's Go Assistant
                    </div>
                </Modal.Header>
                {/* ------------------------------------------------------------- */}
                <Modal.Body className="p-0">
                    <div className="chatbox" ref={chatboxRef}>
                        {messages.map((msg, index) => (
                            <div key={index} className={`chat ${msg.sender === 'bot' ? 'incoming' : 'outgoing'}`}>
                                <p>{msg.text}</p>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="chat incoming">
                                <div className="typing-animation">
                                    <div className="dot"></div>
                                    <div className="dot"></div>
                                    <div className="dot"></div>
                                </div>
                            </div>
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer style={{ borderTop: '1px solid #dee2e6' }}>
                    <Form className="d-flex w-100" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
                        <Form.Control
                            as="textarea"
                            rows={1}
                            placeholder="Ask about flights..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                            style={{ resize: 'none', height: '45px' }}
                        />
                        <Button variant="primary" type="submit" className="ms-2">
                            <SendFill />
                        </Button>
                    </Form>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Chatbot;